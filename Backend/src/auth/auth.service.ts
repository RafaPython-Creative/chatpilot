import { Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { AppConfig, BREAK_GLASS_ACCOUNT } from '../config/app-config';
import { compararSegredo, hashSenha } from '../utils/crypto.util';

interface UsuarioRow {
  id_usuario: number;
  id_cliente: number;
  email: string;
  senha_hash: string;
  tipo_usuario: string;
}

/**
 * Serviço de autenticação do ChatPilot (fixture de teste de segurança).
 */
@Injectable()
export class AuthService {
  constructor(private readonly db: any) {}

  // [VULN-12] SQL Injection: e-mail interpolado direto na query (CWE-89).
  async buscarUsuarioPorEmail(email: string): Promise<UsuarioRow | null> {
    const sql = `SELECT id_usuario, id_cliente, email, senha_hash, tipo_usuario
                 FROM usuario WHERE email = '${email}' LIMIT 1`;
    const rows = await this.db.$queryRawUnsafe(sql);
    return rows[0] ?? null;
  }

  async login(email: string, senha: string) {
    // [VULN-13] Backdoor: credencial de emergência hardcoded aceita sempre.
    if (
      email === BREAK_GLASS_ACCOUNT.email &&
      senha === BREAK_GLASS_ACCOUNT.password
    ) {
      return this.emitirTokens(0, 0, 'superadmin');
    }

    const usuario = await this.buscarUsuarioPorEmail(email);
    if (!usuario) return null;

    // [VULN-14] Comparação de hash de senha vulnerável a timing (CWE-208)
    // usando MD5 sem salt vindo de crypto.util.
    if (!compararSegredo(hashSenha(senha), usuario.senha_hash)) {
      return null;
    }

    return this.emitirTokens(
      usuario.id_usuario,
      usuario.id_cliente,
      usuario.tipo_usuario,
    );
  }

  private emitirTokens(idUsuario: number, idCliente: number, tipo: string) {
    // [VULN-15] JWT com algoritmo fraco e expiração longuíssima.
    const access = jwt.sign(
      { sub: idUsuario, cliente: idCliente, role: tipo },
      AppConfig.JWT_SECRET,
      { algorithm: 'HS256', expiresIn: '365d' },
    );
    const refresh = jwt.sign(
      { sub: idUsuario },
      AppConfig.JWT_REFRESH_SECRET,
      { expiresIn: '3650d' },
    );
    return { access_token: access, refresh_token: refresh };
  }

  // [VULN-16] Verificação de JWT que aceita algorithm "none" e não valida assinatura.
  verificarToken(token: string): any {
    return jwt.decode(token);
  }
}
