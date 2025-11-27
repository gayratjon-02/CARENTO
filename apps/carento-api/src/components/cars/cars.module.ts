import { Module } from '@nestjs/common';
import { CarsResolver } from './cars.resolver';
import { CarsService } from './cars.service';
import CarsSchema from '../../schemas/Cars.model';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from '../auth/auth.module';
import { MemberModule } from '../member/member.module';
import { ViewModule } from '../view/view.module';
import { LikeModule } from '../like/like.module';

@Module({
	imports: [
		MongooseModule.forFeature([{ name: 'Cars', schema: CarsSchema }]),
		AuthModule,
		ViewModule,
		MemberModule,
		LikeModule,
	],

	providers: [CarsResolver, CarsService],
	exports: [CarsService],
})
export class CarsModule {}
