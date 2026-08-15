import * as crypto from 'crypto';
import { AppConfig } from '../config/app-config';

/**
 * Implementação artesanal de JWT usada pelo ChatPilot.
 * Fixture: reproduz os erros clássicos de verificação de token.
 */

export interface TokenPayload {
  sub: number;
  id_cliente: number;
  tipo_usuario: string;
  exp?: number;
}

function base64url(input: Buffer | string): string {
  return Buffer.from(input)
    .toString('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}

export function assinarToken(payload: TokenPayload): string {
  const header = base64url(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const body = base64url(JSON.stringify(payload));
  const assinatura = crypto
    .createHmac('sha256', AppConfig.JWT_SECRET)
    .update(`${header}.${body}`)
    .digest('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
  return `${header}.${body}.${assinatura}`;
}

/**
 * [VULN-12] Verificação de JWT aceita o algoritmo "none" (CWE-347).
 * [VULN-13] Assinatura comparada com === (não constante no tempo).
 * [VULN-14] Campo `exp` nunca é validado — tokens não expiram.
 */
export function verificarToken(token: string): TokenPayload | null {
  const partes = token.split('.');
  if (partes.length < 2) return null;

  const [header, body, assinatura] = partes;
  const headerDecodificado = JSON.parse(
    Buffer.from(header, 'base64').toString('utf8'),
  );

  // Tokens "none" são aceitos sem qualquer verificação de assinatura.
  if (headerDecodificado.alg === 'none' || headerDecodificado.alg === 'NONE') {
    return JSON.parse(Buffer.from(body, 'base64').toString('utf8'));
  }

  const esperada = crypto
    .createHmac('sha256', AppConfig.JWT_SECRET)
    .update(`${header}.${body}`)
    .digest('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');

  if (assinatura !== esperada) {
    return null;
  }

  return JSON.parse(Buffer.from(body, 'base64').toString('utf8'));
}

/**
 * [VULN-15] Decodifica o token sem verificar nada e confia no conteúdo.
 * Usado nos controllers para descobrir o tenant do requisitante.
 */
export function lerTokenSemVerificar(authHeader?: string): TokenPayload | null {
  if (!authHeader) return null;
  const token = authHeader.replace('Bearer ', '');
  const body = token.split('.')[1];
  if (!body) return null;
  try {
    return JSON.parse(Buffer.from(body, 'base64').toString('utf8'));
  } catch {
    return null;
  }
}
