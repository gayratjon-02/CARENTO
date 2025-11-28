import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { Like, MeLiked } from '../../libs/dto/like/like';
import { LikeInput } from '../../libs/dto/like/like.input';
import { T } from '../../libs/types/common';
import { Message } from '../../libs/enums/common.enum';
import { LikeGroup } from '../../libs/enums/like.enum';
import { lookupFavorite } from '../../libs/config';
import { OrdinaryInquiry } from '../../libs/dto/cars/cars.input';
import { Car, CarsList } from '../../libs/dto/cars/cars';

@Injectable()
export class LikeService {
	constructor(@InjectModel('Like') private readonly likeModel: Model<Like>) {}

	public async toggleLike(input: LikeInput): Promise<number> {
		const search: T = { memberId: input.memberId, likeRefId: input.likeRefId },
			exist = await this.likeModel.findOne(search).exec();
		let modifier = 1;
		if (exist) {
			await this.likeModel.findOneAndDelete(search).exec();
			modifier = -1;
		} else {
			try {
				await this.likeModel.create(input);
			} catch (err) {
				console.log('Error, Service.model:', err.message);
				throw new BadRequestException(Message.CREATE_FAILED);
			}
		}

		console.log(`- Like modifier ${modifier} -`);
		return modifier;
	}

	public async checkLikeExistance(input: LikeInput): Promise<MeLiked[]> {
		const { memberId, likeRefId } = input;
		const result = await this.likeModel.findOne({ memberId: memberId, likeRefId: likeRefId }).exec();

		return result ? [{ memberId: memberId, likeRefId: likeRefId, myFavorite: true }] : [];
	}

	public async getFavouriteCars(memberId: ObjectId, input: OrdinaryInquiry): Promise<CarsList> {
		const { page, limit } = input;
		const match: T = { likeGroup: LikeGroup.CAR, memberId: memberId };

		const data: T = await this.likeModel
			.aggregate([
				{ $match: match },
				{ $sort: { updatedAt: -1 } },
				{
					$lookup: {
						from: 'cars',
						localField: 'likeRefId',
						foreignField: '_id',
						as: 'favoriteCars',
					},
				},
				{ $unwind: '$favoriteCars' },
				{
					$facet: {
						list: [
							{ $skip: (page - 1) * limit },
							{ $limit: limit },
							lookupFavorite,
							{ $unwind: '$favoriteCars.memberData' },
						],
						metaCounter: [{ $count: 'total' }],
					},
				},
			])
			.exec();

		const result: CarsList = { list: [], metaCounter: data[0].metaCounter };
		result.list = data[0].list.map((ele: any) => ele.favoriteProperty);

		return result;
	}
}
