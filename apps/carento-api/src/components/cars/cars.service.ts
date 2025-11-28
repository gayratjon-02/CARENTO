import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { AllCarsInquiry, CarsInput, CarsInquiry, OrdinaryInquiry } from '../../libs/dto/cars/cars.input';
import { Car, CarsList } from '../../libs/dto/cars/cars';
import { MemberService } from '../member/member.service';
import { ViewService } from '../view/view.service';
import { InjectModel } from '@nestjs/mongoose';
import { LikeService } from '../like/like.service';
import { Model, ObjectId } from 'mongoose';
import { Direction, Message } from '../../libs/enums/common.enum';
import { StatisticModifier, T } from '../../libs/types/common';
import { CarStatus } from '../../libs/enums/car.enum';
import { ViewGroup } from '../../libs/enums/view.enum';
import { LikeGroup } from '../../libs/enums/like.enum';
import moment from 'moment';
import { CarsUpdate } from '../../libs/dto/cars/cars.update';
import { lookupMember, loopupAuthMemberLiked, shapeIntoMongoObjectId } from '../../libs/config';
import { LikeInput } from '../../libs/dto/like/like.input';
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

	// get cars

	public async getCars(memberId: ObjectId, input: CarsInquiry): Promise<CarsList> {
		const match: T = { carStatus: CarStatus.ACTIVE };
		const sort: T = { [input?.sort ?? 'createdAt']: input?.direction ?? Direction.DESC };

		this.shapeMatchQuery(match, input);
		console.log('match:', match);

		const result = await this.carsModel
			.aggregate([
				{ $match: match },
				{ $sort: sort },
				{
					$facet: {
						list: [
							{ $skip: (input.page - 1) * input.limit },
							{ $limit: input.limit },
							// meLiked
							loopupAuthMemberLiked(memberId),
							lookupMember,
							{ $unwind: '$memberData' },
						],
						metaCounter: [{ $count: 'total' }],
					},
				},
			])
			.exec();
		if (!result.length) throw new InternalServerErrorException(Message.NO_DATA_FOUND);

		return result[0];
	}

	// shape match query

	private shapeMatchQuery(match: T, input: CarsInquiry): void {
		const {
			memberId,
			carLocation,
			carType,
			brandType,
			fuelType,
			transmission,
			seats,
			year,
			pricePerDay,
			pricePerHour,
			mileage,

			text,
		} = input.search;

		if (memberId) match.memberId = shapeIntoMongoObjectId(memberId);
		if (carLocation && carLocation.length) match.carLocation = { $in: location };
		if (carType && carType.length) match.carType = { $in: carType };
		if (brandType && brandType.length) match.brandType = { $in: brandType };
		if (fuelType && fuelType.length) match.fuelType = { $in: fuelType };
		if (transmission && transmission.length) match.transmission = { $in: transmission };
		if (seats && seats.length) match.seats = { $in: seats };
		if (year && year.length) match.year = { $in: year };
		if (pricePerDay) match.pricePerDay = { $gte: pricePerDay.start, $lte: pricePerDay.end };
		if (pricePerHour) match.pricePerHour = { $gte: pricePerHour.start, $lte: pricePerHour.end };
		if (mileage) match.mileage = { $gte: mileage.start, $lte: mileage.end };
		if (text) match.carTitle = { $regex: new RegExp(text, 'i') };
	}

	// get favorites
	public async getFavorites(memberId: ObjectId, input: OrdinaryInquiry): Promise<CarsList> {
		return await this.likeService.getFavouriteCars(memberId, input);
	}
	// get visited

	public async getVisited(memberId: ObjectId, input: OrdinaryInquiry): Promise<CarsList> {
		return await this.viewService.getVisitedCars(memberId, input);
	}
	// get agent cars

	public async getAgentCars(memberId: ObjectId, input: CarsInquiry): Promise<CarsList> {
		const match: T = {
			memberId: memberId,
			carStatus: CarStatus.ACTIVE,
		};
		const sort: T = { [input?.sort ?? 'createdAt']: input?.direction ?? Direction.DESC };

		const result = await this.carsModel
			.aggregate([
				{ $match: match },
				{ $sort: sort },
				{
					$facet: {
						list: [
							{ $skip: (input.page - 1) * input.limit },
							{ $limit: input.limit },
							lookupMember,
							{ $unwind: '$memberData' },
						],
						metaCounter: [{ $count: 'total' }],
					},
				},
			])
			.exec();
		if (!result.length) throw new InternalServerErrorException(Message.NO_DATA_FOUND);

		return result[0];
	}

	//** LIKE CAR **/

	public async likeTargetCar(memberId: ObjectId, likeRefId: ObjectId): Promise<Car> {
		const target: Car = await this.carsModel.findOne({ _id: likeRefId, carStatus: CarStatus.ACTIVE }).exec();
		if (!target) throw new InternalServerErrorException(Message.NO_DATA_FOUND);

		const input: LikeInput = {
			memberId: memberId,
			likeRefId: likeRefId,
			likeGroup: LikeGroup.CAR,
		};

		// Like TOGGLE via like
		const modifier: number = await this.likeService.toggleLike(input);
		const result = await this.carStatsEditor({
			_id: likeRefId,
			targetKey: 'carLikes',
			modifier: modifier,
		});

		if (!result) throw new InternalServerErrorException(Message.SOMETHING_WENT_WRONG);
		return result;
	}

	// ** ADMIN ** /
	public async getAllCarsByAdmin(input: AllCarsInquiry): Promise<CarsList> {
		const { carStatus, carLocation } = input.search;
		const match: T = {};
		const sort: T = { [input?.sort ?? 'createdAt']: input?.direction ?? Direction.DESC };

		if (carStatus) match.carStatus = carStatus;
		if (carLocation) match.carLocation = { $in: carLocation };

		const result = await this.carsModel
			.aggregate([
				{ $match: match },
				{ $sort: sort },
				{
					$facet: {
						list: [
							{ $skip: (input.page - 1) * input.limit },
							{ $limit: input.limit },
							lookupMember,
							{ $unwind: '$memberData' },
						],
						metaCounter: [{ $count: 'total' }],
					},
				},
			])
			.exec();

		if (!result.length) throw new InternalServerErrorException(Message.NO_DATA_FOUND);

		return result[0];
	}

	// update

	public async updateCarByAdmin(input: CarsUpdate): Promise<Car> {
		let { carStatus, deletedAt } = input;
		const search: T = {
			_id: input._id,
			carStatus: CarStatus.ACTIVE,
		};

		if (carStatus === CarStatus.BLOCKED) deletedAt = moment().toDate();
		else if (carStatus === CarStatus.DELETED) deletedAt = moment().toDate();

		const result = await this.carsModel
			.findOneAndUpdate(search, input, {
				new: true,
			})
			.exec();

		if (!result) throw new InternalServerErrorException(Message.UPDATE_FAILED);

		if (deletedAt) {
			await this.memberService.memberStatsEditor({
				_id: result.memberId,
				targetKey: 'memberCars',
				modifier: -1,
			});
		}

		return result;
	}

	// remove cars by admin

	public async removeCarByAdmin(carId: ObjectId): Promise<Car> {
		const search: T = { _id: carId, carStatus: CarStatus.DELETED };
		const result = await this.carsModel.findOneAndDelete(search).exec();
		if (!result) throw new InternalServerErrorException(Message.REMOVE_FAILED);

		return result;
	}

	// car stats editor
	public async carStatsEditor(input: StatisticModifier): Promise<Car> {
		const { _id, targetKey, modifier } = input;
		return await this.carsModel.findByIdAndUpdate(_id, { $inc: { [targetKey]: modifier } }, { new: true }).exec();
	}
}
