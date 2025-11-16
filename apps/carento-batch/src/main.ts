import { NestFactory } from '@nestjs/core';
import { CarentoBatchModule } from './carento-batch.module';

async function bootstrap() {
  const app = await NestFactory.create(CarentoBatchModule);
  await app.listen(process.env.port ?? 3000);
}
bootstrap();
