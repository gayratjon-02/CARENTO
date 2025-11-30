import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Car } from 'apps/carento-api/src/libs/dto/cars/cars';
import { Member } from 'apps/carento-api/src/libs/dto/member/member';
import { CarStatus } from 'apps/carento-api/src/libs/enums/car.enum';
import { MemberStatus, MemberType } from 'apps/carento-api/src/libs/enums/member.enum';
import { Model } from 'mongoose';

@Injectable()
export class BatchService {
	constructor(
		@InjectModel('Property') private readonly propertyModel: Model<Car>,
		@InjectModel('Member') private readonly memberModel: Model<Member>,
	) {}

	public async batchRollback(): Promise<void> {
		await this.propertyModel
			.updateMany(
				{
					carStatus: CarStatus.ACTIVE,
				},
				{ propertyRank: 0 },
			)
			.exec();

		await this.memberModel
			.updateMany(
				{
					memberStatus: MemberStatus.ACTIVE,
					memberType: MemberType.AGENT,
				},
				{ memberRank: 0 },
			)
			.exec();
	}

	public async batchTopCars(): Promise<void> {
		const cars: Car[] = await this.propertyModel
			.find({
				carStatus: CarStatus.ACTIVE,
				propertyRank: 0,
			})
			.exec();

		const promisedList = cars.map(async (ele: Car) => {
			const { _id, carLikes, carViews } = ele;
			const rank = carLikes * 2 + carViews * 1;
			return await this.propertyModel.findByIdAndUpdate(_id, { carRank: rank });
		});
		await Promise.all(promisedList);
	}

	public async batchTopAgents(): Promise<void> {
		const agents: Member[] = await this.memberModel
			.find({
				memberType: MemberType.AGENT,
				memberStatus: MemberStatus.ACTIVE,
				memberRank: 0,
			})
			.exec();

		const promisedList = agents.map(async (ele: Member) => {
			const { _id, memberCars, memberLikes, memberArticles, memberViews } = ele;
			const rank = memberCars * 5 + memberArticles * 3 + memberLikes * 2 + memberViews * 1;
			return await this.memberModel.findByIdAndUpdate(_id, { memberRank: rank });
		});
		await Promise.all(promisedList);
	}
	public getHello(): string {
		return 'Welcome to Nestar BATCH Server!';
	}
}
