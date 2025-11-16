import { Controller, Get } from '@nestjs/common';
import { CarentoBatchService } from './carento-batch.service';

@Controller()
export class CarentoBatchController {
  constructor(private readonly carentoBatchService: CarentoBatchService) {}

  @Get()
  getHello(): string {
    return this.carentoBatchService.getHello();
  }
}
