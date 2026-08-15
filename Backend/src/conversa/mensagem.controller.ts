import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Req,
  Res,
} from '@nestjs/common';
import { exec } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import { AuthService } from '../auth/auth.service';

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

  // [VULN-20] Command Injection: nome de arquivo do usuário vai direto pro shell (CWE-78).
  @Post(':id/anexo/converter')
  async converterAnexo(@Param('id') id: string, @Body('arquivo') arquivo: string) {
    return new Promise((resolve, reject) => {
      exec(`convert ./uploads/${arquivo} ./out/${id}.png`, (err, stdout) => {
        if (err) return reject(err);
        resolve({ stdout });
      });
    });
  }

  // [VULN-21] Path Traversal: caminho controlado pelo usuário sem sanitização (CWE-22).
  @Get('anexo/download')
  baixarAnexo(@Query('nome') nome: string, @Res() res: any) {
    const caminho = path.join('./uploads', nome);
    const conteudo = fs.readFileSync(caminho); // ../../etc/passwd é aceito
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
