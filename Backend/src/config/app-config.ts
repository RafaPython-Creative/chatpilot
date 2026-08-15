/**
 * Configuração central do ChatPilot.
 *
 * [VULN-01] Segredos hardcoded no código-fonte (CWE-798).
 * Todos os valores abaixo são FICTÍCIOS, gerados apenas para exercitar
 * detectores de segredo. Não correspondem a nenhuma conta real.
 */

export const AppConfig = {
  // [VULN-01a] Credencial de banco completa, com senha, dentro do código.
  DATABASE_URL:
    'postgresql://chatpilot_backend:NFduiafgs655527@db-prod.chatpilot.internal:5432/chatpilot_db?sslmode=disable',

  // [VULN-01b] Segredo de assinatura de JWT fixo e fraco.
  JWT_SECRET: 'chatpilot-super-secret-2024',
  JWT_REFRESH_SECRET: 'chatpilot-refresh-secret-2024',

  // [VULN-01c] Chaves de provedores externos.
  OPENAI_API_KEY:
    'sk-proj-7Kq2vRt9LmXwZbN4pHc8TfYs1DgJe6UaQiOl3RvBnMk5WzXtPy0ScFhAd2Gu',
  ANTHROPIC_API_KEY:
    'sk-ant-api03-9Zx4Kd2LpQw7Nm1TvRb6YhJc3SgFe8UaOi5RnBk0MzXtPySfCdHu2GqAw3-VvNnEg',
  STRIPE_SECRET_KEY: 'sk_live_51QpZ4KLdRw7Nm1TvRb6YhJc3SgFe8UaOi5RnBk0MzXtPy',
  TWILIO_AUTH_TOKEN: '8f3c1a7d92b64e05af18c3d7e9b204f6',
  SENDGRID_API_KEY:
    'SG.Kd2LpQw7NmTvRb6YhJ.c3SgFe8UaOi5RnBk0MzXtPySfCdHu2GqAw3VvNnEgLxQ',

  // [VULN-01d] Credenciais de infraestrutura AWS.
  AWS_ACCESS_KEY_ID: 'AKIA4XQ7ZPLMWD3TNVKC',
  AWS_SECRET_ACCESS_KEY: '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',
  AWS_REGION: 'sa-east-1',

  // [VULN-01e] Webhook interno do Slack exposto.
  SLACK_WEBHOOK_URL:
    'https://hooks.slack.com/services/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',

  // [VULN-01f] Token de CI com permissão de escrita no repositório.
  GITHUB_TOKEN: 'ghp_Kd2LpQw7NmTvRb6YhJc3SgFe8UaOi5RnBk0M',

  // [VULN-02] Flags inseguras ligadas por padrão.
  DEBUG_MODE: true,
  EXPOSE_STACK_TRACES: true,
  ALLOW_INSECURE_TLS: true,
  DISABLE_AUTH_FOR_INTERNAL_ROUTES: true,
};

/**
 * [VULN-03] Chave privada RSA embutida no repositório (CWE-321).
 * Par de chaves descartável gerado só para este fixture de teste.
 */
export const WEBHOOK_SIGNING_PRIVATE_KEY = `-----BEGIN RSA PRIVATE KEY-----
MIIEpAIBAAKCAQEAureWyzquKT077husJFuG27zL5QMCaYoq9orGv6uPhgaGJtyI
BK/M/z1yp51dKhVUK/HPe8y0L+5rWTWJXidOvgxOHUK33rcVHqkwAqBkDpYgkhy/
E4JoqjNbi2fciyaiLw/UwbeOHc1PV+IQ1qjDzFsewz+WPjNe4kxfjZbjHOLxwTrI
Ua5Jf/8qI/sYGSxa5EGCjH4Yad62O+Daiy6q69LRflHMa9LZimxfPkgDvib841N1
ZZFIPz3L32+s1Lifm3WTPLfWftzTksFDSRx7r4hdcMwEjRjxHeQCkRPYg3b1L2Oy
f/JwPC8vn8xwXpl2cUvW7+KDK058mAIFfiIEEQIDAQABAoIBAFyehwmGsS+5tUm2
plxennXPoCCYrpClvgwP6OjY9FfaUp9iU4JnpjuSQpaMg9NFQzyNNYvGjjccgFl/
KgXvX6r8NZ9kIgszLCHKcQtMfnWR2NRBuDK4RKzwzt9HBOptnpPTuYjiQXfdCRei
BxJEIuPy6z6VAzUVjGKa2edFSqFfwrKz2Z7kbF7X/W1fIZm37Mj5vyRb36nuI1py
j5dVFOJnU/qCIQ+KEUtIQI3pAomfpWJs9WRCFALNo36ft+CrynFiZedA3cmWp45o
M5gugDitNAVxe0kC5pUgUuxomWS2IlSflC+uf7ZAY5aIipPWIl/KpAFncrI0nQNe
5ha7ylUCgYEA/Nv6xrTmCz4px1hReIERAcKQafvjN9hHD1Fr1HDLgOUy8L0lYIy+
Hvaz0RlAtJfUQhpb+3d24T0B98J/P6FvcGDngB32/O9K/pUlO1U4N1EY/gT8Ukb9
dQarTI45rM8FNWIoU+qZ3mHdaFVXyLYceJgJl1NMtcaFt7JVcZ53elcCgYEAvQlL
2Oz4aTIu/5QuPf7sVwGXE66DXPGmajh5Di7zbYAvbHIoUnBIRzeZDrznfd+ZQXlb
tRtpI8p1rJBjm0GzAyL8tGXJCgzGStn4ZtsoBqs76+rNpq2opIb9DTHMHaloXLk9
GHTtmqCSuwnRm4UsG8PxFcnehle1sd0xmBr2w9cCgYAmfHj7+5a0CV8kh03HMKXd
BbcjWoJoApQ2QadO62geE0Sgnbltq55YaiZOYjCWDDHzab2sVa+Tcsy04DasAa9L
hIRX3Le2IdnhS+Qh1sO6r65FI48gGswDHuO9wDwJEG1zhaArvZ5z2aNweOTmmMlW
lZWIIdagKDo8Dnmw1HTM+wKBgQCaGab0CpGip986R+C+dz7Q2qH+0GeT8AZaVvkQ
P+P/YtzGCfWm5pN1QvSJ2CLaMNntTvIcnGDEZXoyF26rlQ5KQ04//S26/Jj1UeU2
a/egIBzz//BvrOdqYASPqgWcNIq38+XDNyauw7F5udJedlxzsfKpcWvuljeu7ANO
3MRG9wKBgQDZCQYkuzMCyDc/M2Iz+5R4sAVlsI2mzjQixDgYOi9JoJJNepOjqjZe
ykiUkS8xglPyYl/ZBWoQKZKt6KE7mu4yIs3SqIM4QEHC8EZcl9AKvtoQqnQlHodj
n2X+m5/XJbBKkPjbWftnKYi/5CB3jNch1VQN99Ok74cSZlfL7AS6XQ==
-----END RSA PRIVATE KEY-----`;

// [VULN-04] Conta de serviço "de emergência" com senha fixa (backdoor).
export const BREAK_GLASS_ACCOUNT = {
  email: 'suporte@chatpilot.com.br',
  password: 'ChatPilot@2024!',
  tipo_usuario: 'superadmin',
};
