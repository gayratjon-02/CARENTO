import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { CarsInput } from '../../libs/dto/cars/cars.input';
import { Car } from '../../libs/dto/cars/cars';
import { MemberService } from '../member/member.service';
import { ViewService } from '../view/view.service';
import { InjectModel } from '@nestjs/mongoose';
import { LikeService } from '../like/like.service';
import { Model, ObjectId } from 'mongoose';
import { Message } from '../../libs/enums/common.enum';
import { StatisticModifier, T } from '../../libs/types/common';
import { CarStatus } from '../../libs/enums/car.enum';
import { ViewGroup } from '../../libs/enums/view.enum';
import { LikeGroup } from '../../libs/enums/like.enum';
import moment from 'moment';
import { CarsUpdate } from '../../libs/dto/cars/cars.update';
@Injectable()
export class CarsService {
	constructor(
		@InjectModel('Cars') private readonly carsModel: Model<Car>,
		private memberService: MemberService,
		private viewService: ViewService,
		private likeService: LikeService,
	) {}

	public async createCar(input: CarsInput): Promise<Car> {
		try {
			const result = await this.carsModel.create(input);
			return result;
		} catch (err) {
			console.log('Error, Cars Service createCar', err);
			throw new BadRequestException(Message.CREATE_FAILED);
		}
	}

	public async getCar(memberId: ObjectId, carId: ObjectId): Promise<Car> {
		const search: T = {
			_id: carId,
			carStatus: CarStatus.ACTIVE,
		};

		const targetProperty: Car = await this.carsModel.findOne(search).lean().exec();
		if (!targetProperty) throw new InternalServerErrorException(Message.NO_DATA_FOUND);

		if (memberId) {
			const viewInput = { memberId: memberId, viewRefId: carId, viewGroup: ViewGroup.CAR };
			const newView = await this.viewService.recordView(viewInput);
			if (newView) {
				await this.carStatsEditor({ _id: carId, targetKey: 'carViews', modifier: 1 });
				targetProperty.carViews++;
			}

			//meLiked
			const likeInput = { memberId: memberId, likeRefId: carId, likeGroup: LikeGroup.CAR };
			targetProperty.meLiked = await this.likeService.checkLikeExistance(likeInput);
		}
		targetProperty.memberData = await this.memberService.getMember(null, targetProperty.memberId);
		return targetProperty;
	}

	// cars edit
	public async updateCar(memberId: ObjectId, input: CarsUpdate): Promise<Car> {
		let { carStatus, deletedAt } = input;

		const search: T = {
			_id: input._id,
			memberId: memberId,
			carStatus: CarStatus.ACTIVE,
		};
		if (carStatus === CarStatus.BLOCKED) deletedAt = moment().toDate();
		else if (carStatus === CarStatus.DELETED) deletedAt = moment().toDate();

		const result = await this.carsModel.findOneAndUpdate(search, input, { new: true }).exec();

		if (!result) throw new InternalServerErrorException(Message.UPDATE_FAILED);

		if (deletedAt) {
			await this.memberService.memberStatsEditor({
				_id: memberId,
				targetKey: 'memberProperties',
				modifier: -1,
			});
		}
		return result;
	}

	// car stats editor
	public async carStatsEditor(input: StatisticModifier): Promise<Car> {
		const { _id, targetKey, modifier } = input;
		return await this.carsModel.findByIdAndUpdate(_id, { $inc: { [targetKey]: modifier } }, { new: true }).exec();
	}
}
