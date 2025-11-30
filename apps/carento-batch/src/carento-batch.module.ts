import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { ScheduleModule } from '@nestjs/schedule';
import { MongooseModule } from '@nestjs/mongoose';
import CarsSchema from 'apps/carento-api/src/schemas/Cars.model';
import MemberSchema from 'apps/carento-api/src/schemas/Member.model';
import { BatchController } from './carento-batch.controller';
import { BatchService } from './carento-batch.service';
@Module({
	imports: [
		MongooseModule.forFeature([{ name: 'Member', schema: MemberSchema }]),
		MongooseModule.forFeature([{ name: 'Property', schema: CarsSchema }]),
		ConfigModule.forRoot(),
		DatabaseModule,
		ScheduleModule.forRoot(),
	],
	controllers: [BatchController],
	providers: [BatchService],
})
export class CarentoBatchModule {}
