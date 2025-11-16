import { NestFactory } from '@nestjs/core';
import { CarentoBatchModule } from './carento-batch.module';

async function bootstrap() {
  const app = await NestFactory.create(CarentoBatchModule);
  await app.listen(process.env.PORT_BATCH ?? 3000);
}
bootstrap();
