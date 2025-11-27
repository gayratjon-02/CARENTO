import { BadRequestException, Injectable } from '@nestjs/common';
import { CarsInput } from '../../libs/dto/cars/cars.input';
import { Cars } from '../../libs/dto/cars/cars';
import { MemberService } from '../member/member.service';
import { ViewService } from '../view/view.service';
import { InjectModel } from '@nestjs/mongoose';
import { LikeService } from '../like/like.service';
import { Model } from 'mongoose';
import { Message } from '../../libs/enums/common.enum';
@Injectable()
export class CarsService {
	constructor(
		@InjectModel('Cars') private readonly carsModel: Model<Cars>,
		private memberService: MemberService,
		private viewService: ViewService,
		private likeService: LikeService,
	) {}

	public async createCar(input: CarsInput): Promise<Cars> {
		try {
            const result = await this.carsModel.create(input);
            return result;
		} catch (err) {
			console.log('Error, Cars Service createCar', err);
			throw new BadRequestException(Message.CREATE_FAILED);
		}
	}
}
