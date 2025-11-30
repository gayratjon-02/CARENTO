import { Mutation, Args, Resolver } from '@nestjs/graphql';
import { NotificationService } from './notification.service';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/guards/auth.guard';
import { Notification } from '../../libs/dto/notification/notification';
import { NotificationInput } from '../../libs/dto/notification/notification.input';
import { AuthMember } from '../auth/decorators/authMember.decorator';
import { ObjectId } from 'mongoose';

@Resolver()
export class NotificationResolver {
	constructor(private readonly notificationService: NotificationService) {}

	//createNotification
	@UseGuards(AuthGuard)
	@Mutation(() => Notification)
	public async createNotification(
		@Args('input') input: NotificationInput,
		@AuthMember('_id') memberId: ObjectId,
	): Promise<Notification> {
        console.log('Mutation: createNotification');
		return await this.notificationService.createNotification(input, memberId);
	}
}
