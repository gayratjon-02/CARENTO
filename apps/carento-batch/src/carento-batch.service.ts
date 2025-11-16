import { Injectable } from '@nestjs/common';

@Injectable()
export class CarentoBatchService {
  getHello(): string {
    return 'Hello to Carento Batch!';
  }
}
