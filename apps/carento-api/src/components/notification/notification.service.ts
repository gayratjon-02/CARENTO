import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { NotificationInput } from '../../libs/dto/notification/notification.input';
import { Notification } from '../../libs/dto/notification/notification';
import { Message } from '../../libs/enums/common.enum';
import { NotificationGroup } from '../../libs/enums/notification.enum';
import { shapeIntoMongoObjectId } from '../../libs/config';

@Injectable()
export class NotificationService {
	constructor(@InjectModel('Notification') private readonly notificationModel: Model<Notification>) {}

	//createNotification
	public async createNotification(input: NotificationInput, memberId: ObjectId): Promise<Notification> {
		try {
			input.authorId = memberId;

			
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
}
