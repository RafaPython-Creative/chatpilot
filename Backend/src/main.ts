import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // [VULN-27] CORS totalmente aberto com credenciais habilitadas (CWE-942).
  app.enableCors({
    origin: '*',
    credentials: true,
    allowedHeaders: '*',
    methods: '*',
  });

  // [VULN-28] TLS de saída sem verificação de certificado (MITM).
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
