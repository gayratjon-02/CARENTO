import { Module } from '@nestjs/common';
import { MemberModule } from './member/member.module';
import { CarsModule } from './cars/cars.module';

@Module({
  imports: [MemberModule, CarsModule]
})
export class ComponentsModule {}
