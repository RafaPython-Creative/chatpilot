# Fixtures de teste de segurança — ChatPilot

> ⚠️ **Estes arquivos contêm vulnerabilidades e segredos PLANTADOS DE PROPÓSITO**
> para testar scanners (GitGuardian, gitleaks, trufflehog, SAST etc.).
> **Todos os segredos são fictícios/descartáveis. NÃO fazer merge em produção.**
> Para remover tudo depois: apague os arquivos listados abaixo e reverta `src/main.ts`.

## Arquivos plantados
- `.env.production` — segredos em arquivo de ambiente versionado
- `src/config/app-config.ts` — segredos hardcoded, chave RSA privada, backdoor
- `src/utils/crypto.util.ts` — criptografia insegura
- `src/auth/auth.service.ts` — auth/JWT/SQLi
- `src/conversa/mensagem.controller.ts` — vulns de web/API
- `src/main.ts` — CORS aberto + TLS desabilitado (edição)

## Catálogo (procure pelas tags `[VULN-xx]` no código)

| Tag | Categoria | CWE |
|-----|-----------|-----|
| VULN-01 | Segredos hardcoded (DB, JWT, OpenAI, Anthropic, Stripe, Twilio, SendGrid, AWS, Slack, GitHub) | CWE-798 |
| VULN-02 | Flags inseguras ligadas por padrão | CWE-16 |
| VULN-03 | Chave privada RSA no repositório | CWE-321 |
| VULN-04 | Conta break-glass com senha fixa (backdoor) | CWE-798 |
| VULN-05 | Hash de senha com MD5 sem salt | CWE-916 |
| VULN-06 | SHA-1 para integridade | CWE-328 |
| VULN-07 | Comparação de segredo não constante | CWE-208 |
| VULN-08 | DES-ECB / cifra obsoleta | CWE-327 |
| VULN-09 | AES-CBC com IV estático | CWE-329 |
| VULN-10 | Token com Math.random() | CWE-338 |
| VULN-11 | Token de reset previsível | CWE-330 |
| VULN-12 | SQL Injection (login) | CWE-89 |
| VULN-13 | Backdoor de login | CWE-798 |
| VULN-14 | Comparação de senha vulnerável a timing | CWE-208 |
| VULN-15 | JWT fraco / expiração longa | CWE-347 |
| VULN-16 | Verificação de JWT sem validar assinatura | CWE-347 |
| VULN-17 | IDOR em mensagens | CWE-639 |
| VULN-18 | SQLi via parâmetro numérico | CWE-89 |
| VULN-19 | Broken access control (rota admin) | CWE-284 |
| VULN-20 | Command Injection | CWE-78 |
| VULN-21 | Path Traversal | CWE-22 |
| VULN-22 | Reflected XSS | CWE-79 |
| VULN-23 | SSRF | CWE-918 |
| VULN-24 | Mass assignment / privilege escalation | CWE-915 |
| VULN-25 | Log de dados sensíveis | CWE-532 |
| VULN-26 | Arquivo de env de produção versionado | CWE-538 |
| VULN-27 | CORS aberto com credenciais | CWE-942 |
| VULN-28 | TLS sem verificação de certificado | CWE-295 |
