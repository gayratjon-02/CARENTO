import { Test, TestingModule } from '@nestjs/testing';
import { CarentoBatchController } from './carento-batch.controller';
import { CarentoBatchService } from './carento-batch.service';

describe('CarentoBatchController', () => {
  let carentoBatchController: CarentoBatchController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [CarentoBatchController],
      providers: [CarentoBatchService],
    }).compile();

    carentoBatchController = app.get<CarentoBatchController>(CarentoBatchController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(carentoBatchController.getHello()).toBe('Hello World!');
    });
  });
});
