import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { NotificationInput, NotificationsInquiry } from '../../libs/dto/notification/notification.input';
import { Notification, NotificationsList } from '../../libs/dto/notification/notification';
import { Message } from '../../libs/enums/common.enum';
import { NotificationGroup, NotificationStatus } from '../../libs/enums/notification.enum';
import { shapeIntoMongoObjectId } from '../../libs/config';
import { Direction } from '../../libs/enums/common.enum';
import { T } from '../../libs/types/common';

@Injectable()
export class NotificationService {
	constructor(@InjectModel('Notification') private readonly notificationModel: Model<Notification>) {}

	//createNotification
	public async createNotification(input: NotificationInput, authorId: ObjectId): Promise<Notification> {
		try {
			input.authorId = authorId;

			input.receiverId = shapeIntoMongoObjectId(input.receiverId);
			if (input.carId) input.carId = shapeIntoMongoObjectId(input.carId);
			if (input.articleId) input.articleId = shapeIntoMongoObjectId(input.articleId);

			// Validate: Cannot create notification for yourself
			if (input.authorId.toString() === input.receiverId.toString()) {
				throw new BadRequestException(Message.INVALID_REQUEST);
			}

			if (input.notificationGroup === NotificationGroup.CAR && !input.carId) {
				throw new BadRequestException(Message.INVALID_REQUEST);
			}
			if (input.notificationGroup === NotificationGroup.ARTICLE && !input.articleId) {
				throw new BadRequestException(Message.INVALID_REQUEST);
			}
			if (input.notificationGroup === NotificationGroup.MEMBER && (input.carId || input.articleId)) {
				throw new BadRequestException(Message.INVALID_REQUEST);
			}

			const result = await this.notificationModel.create(input);
			if (!result) throw new BadRequestException(Message.CREATE_FAILED);
			return result;
		} catch (error) {
			if (error instanceof BadRequestException) {
				throw error;
			}
			throw new BadRequestException(Message.CREATE_FAILED);
		}
	}

	//getNotifications
	public async getNotifications(memberId: ObjectId, input: NotificationsInquiry): Promise<NotificationsList> {
		const match: T = { receiverId: memberId };
		const sort: T = { [input?.sort ?? 'createdAt']: input?.direction ?? Direction.DESC };

		if (input?.search?.notificationType) match.notificationType = input.search.notificationType;
		if (input?.search?.notificationGroup) match.notificationGroup = input.search.notificationGroup;
		if (input?.search?.notificationStatus) match.notificationStatus = input.search.notificationStatus;

		const page = input?.page ?? 1;
		const limit = input?.limit ?? 10;

		const result = await this.notificationModel
			.aggregate([
				{ $match: match },
				{ $sort: sort },
				{
					$facet: {
						list: [
							{ $skip: (page - 1) * limit },
							{ $limit: limit },
							{
								$lookup: {
									from: 'members',
									localField: 'authorId',
									foreignField: '_id',
									as: 'authorData',
								},
							},
							{ $unwind: { path: '$authorData', preserveNullAndEmptyArrays: true } },
							{
								$lookup: {
									from: 'members',
									localField: 'receiverId',
									foreignField: '_id',
									as: 'receiverData',
								},
							},
							{ $unwind: { path: '$receiverData', preserveNullAndEmptyArrays: true } },
							{
								$lookup: {
									from: 'cars',
									localField: 'carId',
									foreignField: '_id',
									as: 'carData',
								},
							},
							{ $unwind: { path: '$carData', preserveNullAndEmptyArrays: true } },
							{
								$lookup: {
									from: 'articles',
									localField: 'articleId',
									foreignField: '_id',
									as: 'articleData',
								},
							},
							{ $unwind: { path: '$articleData', preserveNullAndEmptyArrays: true } },
						],
						metaCounter: [{ $count: 'total' }],
					},
				},
			])
			.exec();

		const response = result?.[0] ?? { list: [], metaCounter: [] };
		if (!response.metaCounter?.length) response.metaCounter = [{ total: 0 }];
		return response;
	}

	//readNotification
	public async readNotification(id: string, memberId: ObjectId): Promise<Notification> {
		const notificationId = shapeIntoMongoObjectId(id);
		const result = await this.notificationModel
			.findOneAndUpdate(
				{ _id: notificationId, receiverId: memberId },
				{ $set: { notificationStatus: NotificationStatus.READ } },
				{ new: true },
			)
			.exec();
		if (!result) throw new BadRequestException(Message.NO_DATA_FOUND);
		return result;
	}

	// readAllNotifications
	public async readAllNotifications(memberId: ObjectId): Promise<Notification[]> {
		await this.notificationModel
			.updateMany(
				{ receiverId: memberId, notificationStatus: NotificationStatus.WAIT },
				{ $set: { notificationStatus: NotificationStatus.READ } },
			)
			.exec();
		const list = await this.getNotifications(memberId, { page: 1, limit: 1000 });
		return list?.list ?? [];
	}

	// deleteNotification
	public async deleteNotification(id: string, memberId: ObjectId): Promise<Notification> {
		const notificationId = shapeIntoMongoObjectId(id);
		const result = await this.notificationModel.findOneAndDelete({ _id: notificationId, receiverId: memberId }).exec();
		if (!result) throw new BadRequestException(Message.NO_DATA_FOUND);
		return result;
	}
}
