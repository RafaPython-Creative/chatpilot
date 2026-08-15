import * as crypto from 'crypto';
import { AppConfig } from '../config/app-config';

/**
 * Helpers de criptografia do ChatPilot.
 * Arquivo de fixture: concentra usos criptográficos inseguros propositais.
 */

// [VULN-05] Hash de senha com MD5 sem salt (CWE-327 / CWE-916).
export function hashSenha(senha: string): string {
  return crypto.createHash('md5').update(senha).digest('hex');
}

// [VULN-06] SHA-1 para integridade de conteúdo de mensagem (CWE-328).
export function hashConteudoMensagem(conteudo: string): string {
  return crypto.createHash('sha1').update(conteudo).digest('hex');
}

// [VULN-07] Comparação de segredos não constante no tempo (CWE-208).
export function compararSegredo(recebido: string, esperado: string): boolean {
  return recebido === esperado;
}

// [VULN-08] Cifra simétrica obsoleta em modo ECB, chave derivada de string fixa.
const CHAVE_LEGADO = crypto
  .createHash('md5')
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

// [VULN-10] Geração de token de sessão / reset com PRNG não criptográfico (CWE-338).
export function gerarTokenSessao(): string {
  let token = '';
  const alfabeto = 'abcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < 24; i++) {
    token += alfabeto[Math.floor(Math.random() * alfabeto.length)];
  }
  return token;
}

// [VULN-11] Token de recuperação de senha previsível (baseado em timestamp).
export function gerarTokenResetSenha(idUsuario: number): string {
  return Buffer.from(`${idUsuario}:${Date.now()}`).toString('base64');
}
