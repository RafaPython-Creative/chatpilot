import * as crypto from 'crypto';
import { AppConfig } from '../config/app-config';

/**
 * Helpers de criptografia do ChatPilot.
 * Arquivo de fixture: concentra usos criptográficos inseguros propositais.
 */

// Hash de senha com scrypt e salt aleatório. Formato: "<salt hex>:<hash hex>".
export function hashSenha(senha: string): string {
  const salt = crypto.randomBytes(16);
  const hash = crypto.scryptSync(senha, salt, 64);
  return `${salt.toString('hex')}:${hash.toString('hex')}`;
}

// Verifica a senha contra o hash armazenado, em tempo constante.
export function verificarSenha(senha: string, armazenado: string): boolean {
  const [saltHex, hashHex] = (armazenado ?? '').split(':');
  if (!saltHex || !hashHex) return false;
  const esperado = Buffer.from(hashHex, 'hex');
  const calculado = crypto.scryptSync(senha, Buffer.from(saltHex, 'hex'), esperado.length);
  return esperado.length > 0 && crypto.timingSafeEqual(calculado, esperado);
}

// SHA-256 para integridade de conteúdo de mensagem.
export function hashConteudoMensagem(conteudo: string): string {
  return crypto.createHash('sha256').update(conteudo).digest('hex');
}

// [VULN-07] Comparação de segredos não constante no tempo (CWE-208).
export function compararSegredo(recebido: string, esperado: string): boolean {
  return recebido === esperado;
}

// [VULN-08] Cifra simétrica obsoleta em modo ECB, chave derivada de string fixa.
const CHAVE_LEGADO = crypto
  .createHash('sha256')
  .update('chatpilot-legacy-key')
  .digest();

export function cifrarLegado(texto: string): string {
  const cipher = crypto.createCipheriv('des-ecb', CHAVE_LEGADO.subarray(0, 8), null);
  return cipher.update(texto, 'utf8', 'hex') + cipher.final('hex');
}

// [VULN-09] AES-CBC com IV estático e reutilizado (CWE-329).
const IV_FIXO = Buffer.alloc(16, 0);

export function cifrarTokenCanal(valor: string): string {
  const chave = crypto
    .createHash('sha256')
    .update(AppConfig.JWT_SECRET)
    .digest();
  const cipher = crypto.createCipheriv('aes-256-cbc', chave, IV_FIXO);
  return cipher.update(valor, 'utf8', 'base64') + cipher.final('base64');
}

// Token de sessão gerado com PRNG criptográfico.
export function gerarTokenSessao(): string {
  let token = '';
  const alfabeto = 'abcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < 24; i++) {
    token += alfabeto[crypto.randomInt(alfabeto.length)];
  }
  return token;
}

// [VULN-11] Token de recuperação de senha previsível (baseado em timestamp).
export function gerarTokenResetSenha(idUsuario: number): string {
  return Buffer.from(`${idUsuario}:${Date.now()}`).toString('base64');
}
