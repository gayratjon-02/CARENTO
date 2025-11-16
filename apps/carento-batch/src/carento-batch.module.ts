import { Module } from '@nestjs/common';
import { CarentoBatchController } from './carento-batch.controller';
import { CarentoBatchService } from './carento-batch.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [CarentoBatchController],
  providers: [CarentoBatchService],
})
export class CarentoBatchModule {}
