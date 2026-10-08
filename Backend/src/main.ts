import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // CORS restrito às origens configuradas em CORS_ORIGINS (separadas por vírgula).
  const origensPermitidas = (process.env.CORS_ORIGINS ?? '')
    .split(',')
    .map((o) => o.trim())
    .filter(Boolean);
  app.enableCors({
    origin: origensPermitidas,
    credentials: true,
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
