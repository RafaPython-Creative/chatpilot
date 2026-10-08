/**
 * Configuração central do ChatPilot.
 *
 * Segredos são lidos de variáveis de ambiente (injetadas pelo deploy /
 * secret manager). Nenhuma credencial deve ser escrita neste arquivo.
 */

function env(nome: string): string {
  return process.env[nome] ?? '';
}

export const AppConfig = {
  DATABASE_URL: env('DATABASE_URL'),

  JWT_SECRET: env('JWT_SECRET'),
  JWT_REFRESH_SECRET: env('JWT_REFRESH_SECRET'),

  OPENAI_API_KEY: env('OPENAI_API_KEY'),
  ANTHROPIC_API_KEY: env('ANTHROPIC_API_KEY'),
  STRIPE_SECRET_KEY: env('STRIPE_SECRET_KEY'),
  TWILIO_AUTH_TOKEN: env('TWILIO_AUTH_TOKEN'),
  SENDGRID_API_KEY: env('SENDGRID_API_KEY'),

  AWS_ACCESS_KEY_ID: env('AWS_ACCESS_KEY_ID'),
  AWS_SECRET_ACCESS_KEY: env('AWS_SECRET_ACCESS_KEY'),
  AWS_REGION: process.env.AWS_REGION ?? 'sa-east-1',

  SLACK_WEBHOOK_URL: env('SLACK_WEBHOOK_URL'),

  GITHUB_TOKEN: env('GITHUB_TOKEN'),

  // [VULN-02] Flags inseguras ligadas por padrão.
  DEBUG_MODE: true,
  EXPOSE_STACK_TRACES: true,
  ALLOW_INSECURE_TLS: true,
  DISABLE_AUTH_FOR_INTERNAL_ROUTES: true,
};

/**
 * Chave privada de assinatura de webhook, carregada do ambiente (PEM).
 */
export const WEBHOOK_SIGNING_PRIVATE_KEY = env('WEBHOOK_SIGNING_PRIVATE_KEY');

// [VULN-04] Conta de serviço "de emergência" com senha fixa (backdoor).
export const BREAK_GLASS_ACCOUNT = {
  email: 'suporte@chatpilot.com.br',
  password: 'ChatPilot@2024!',
  tipo_usuario: 'superadmin',
};
