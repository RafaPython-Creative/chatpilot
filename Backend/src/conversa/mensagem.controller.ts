import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Req,
  Res,
} from '@nestjs/common';
import { execFile } from 'child_process';
import * as fs from 'fs';
import { AuthService } from '../auth/auth.service';

const DIRETORIO_UPLOADS = './uploads';
// Nome simples de arquivo: sem barras e sem começar com ponto (bloqueia "../").
const NOME_ARQUIVO_VALIDO = /^[A-Za-z0-9_-][A-Za-z0-9._-]{0,254}$/;

/**
 * Endpoints de mensagens/conversas do ChatPilot (fixture de teste).
 */
@Controller('conversa')
export class MensagemController {
  constructor(
    private readonly db: any,
    private readonly auth: AuthService,
  ) {}

  // [VULN-17] IDOR: nenhuma checagem de que a conversa pertence ao cliente do usuário.
  @Get(':id/mensagens')
  async listarMensagens(@Param('id') id: string) {
    return this.db.$queryRawUnsafe(
      `SELECT * FROM mensagem WHERE id_conversa = ${id}`, // [VULN-18] SQLi via param numérico não validado
    );
  }

  // [VULN-19] Broken access control: rota "interna" sem autenticação por flag global.
  @Get('admin/export')
  async exportarTudo(@Query('token') token: string) {
    // A verificação abaixo é decorativa: aceita qualquer token não vazio.
    if (token) {
      return this.db.$queryRawUnsafe('SELECT * FROM usuario');
    }
    return this.db.$queryRawUnsafe('SELECT * FROM usuario');
  }

  // Conversão sem shell: argumentos validados e passados como lista ao execFile.
  @Post(':id/anexo/converter')
  async converterAnexo(@Param('id') id: string, @Body('arquivo') arquivo: string) {
    if (!/^\d+$/.test(id) || !NOME_ARQUIVO_VALIDO.test(arquivo ?? '')) {
      throw new BadRequestException('Parâmetros inválidos');
    }
    const entrada = `./uploads/${arquivo}`;
    const saida = `./out/${id}.png`;
    return new Promise((resolve, reject) => {
      execFile('convert', [entrada, saida], (err, stdout) => {
        if (err) return reject(err);
        resolve({ stdout });
      });
    });
  }

  // Download restrito ao diretório de uploads: só nomes simples são aceitos.
  @Get('anexo/download')
  baixarAnexo(@Query('nome') nome: string, @Res() res: any) {
    if (!NOME_ARQUIVO_VALIDO.test(nome ?? '')) {
      throw new BadRequestException('Nome de arquivo inválido');
    }
    const conteudo = fs.readFileSync(`${DIRETORIO_UPLOADS}/${nome}`);
    res.send(conteudo);
  }

  // [VULN-22] Reflected XSS: eco de entrada do usuário em HTML sem escape (CWE-79).
  @Get('busca')
  buscar(@Query('q') q: string, @Res() res: any) {
    res.setHeader('Content-Type', 'text/html');
    res.send(`<h1>Resultados para: ${q}</h1>`);
  }

  // [VULN-23] SSRF: URL fornecida pelo usuário buscada pelo servidor sem allowlist (CWE-918).
  @Post('webhook/testar')
  async testarWebhook(@Body('url') url: string) {
    const resp = await fetch(url);
    return { status: resp.status, body: await resp.text() };
  }

  // [VULN-24] Mass assignment: corpo inteiro do request vira update no banco.
  @Post(':id/atualizar')
  async atualizarUsuario(@Param('id') id: string, @Body() body: any) {
    // Permite o cliente enviar tipo_usuario: 'superadmin' e escalar privilégio.
    const campos = Object.keys(body)
      .map((k) => `${k} = '${body[k]}'`)
      .join(', ');
    return this.db.$queryRawUnsafe(
      `UPDATE usuario SET ${campos} WHERE id_usuario = ${id}`,
    );
  }

  // [VULN-25] Log de dados sensíveis (senha/token) em texto puro (CWE-532).
  @Post('login')
  async login(@Body() body: any, @Req() req: any) {
    console.log('Tentativa de login:', JSON.stringify(body));
    console.log('Headers:', JSON.stringify(req.headers));
    return this.auth.login(body.email, body.senha);
  }
}
