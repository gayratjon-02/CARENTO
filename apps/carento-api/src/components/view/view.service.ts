import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { T } from '../../libs/types/common';
import { ViewGroup } from '../../libs/enums/view.enum';
import { lookupVisit } from '../../libs/config';
import { ViewInput } from '../../libs/dto/view/view.input';
import { View } from '../../libs/dto/view/view';
import { OrdinaryInquiry } from '../../libs/dto/cars/cars.input';
import { Cars, CarsList } from '../../libs/dto/cars/cars';

@Injectable()
export class ViewService {
	constructor(@InjectModel('View') private readonly viewModel: Model<View>) {}

	public async recordView(input: ViewInput): Promise<View | null> {
		const viewExist = await this.checkViewExistance(input);
		if (!viewExist) {
			console.log('- New View Insert - ');
			return await this.viewModel.create(input);
		} else return null;
	}

	private async checkViewExistance(input: ViewInput): Promise<View | null> {
		const { memberId, viewRefId } = input;
		const search: T = { memberId: memberId, viewRefId: viewRefId };
		return await this.viewModel.findOne(search).exec();
	}

	public async getVisitedCars(memberId: ObjectId, input: OrdinaryInquiry): Promise<CarsList> {
		const { page, limit } = input;
		const match: T = { viewGroup: ViewGroup.CAR, memberId: memberId };

		const data: T = await this.viewModel
			.aggregate([
				{ $match: match },
				{ $sort: { updatedAt: -1 } },
				{
					$lookup: {
						from: 'cars',
						localField: 'viewRefId',
						foreignField: '_id',
						as: 'visitedCars',
					},
				},
				{ $unwind: '$visitedCars' },
				{
					$facet: {
						list: [
							{ $skip: (page - 1) * limit },
							{ $limit: limit },
							lookupVisit,
							{ $unwind: '$visitedCars.memberData' },
						],
						metaCounter: [{ $count: 'total' }],
					},
				},
			])
			.exec();

		const result: CarsList = { list: [], metaCounter: data[0].metaCounter };
		result.list = data[0].list.map((ele) => ele.visitedProperty);

		return result;
	}
}
