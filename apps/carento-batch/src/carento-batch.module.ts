import { Module } from '@nestjs/common';
import { CarentoBatchController } from './carento-batch.controller';
import { CarentoBatchService } from './carento-batch.service';

@Module({
  imports: [],
  controllers: [CarentoBatchController],
  providers: [CarentoBatchService],
})
export class CarentoBatchModule {}
