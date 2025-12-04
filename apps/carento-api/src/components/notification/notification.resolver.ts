import { Mutation, Args, Resolver, Query } from '@nestjs/graphql';
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

	//getNotifications
	@UseGuards(AuthGuard)
	@Query(() => [Notification])
	public async getNotifications(@AuthMember('_id') memberId: ObjectId): Promise<Notification[]> {
		console.log('Query: getNotifications');
		return await this.notificationService.getNotifications(memberId);
	}

	//readNotification
	@UseGuards(AuthGuard)
	@Mutation(() => Notification)
	public async readNotification(@Args('id') id: string, @AuthMember('_id') memberId: ObjectId): Promise<Notification> {
		console.log('Mutation: readNotification');
		return await this.notificationService.readNotification(id, memberId);
	}

	// readAllNotifications
	@UseGuards(AuthGuard)
	@Mutation(() => [Notification])
	public async readAllNotifications(@AuthMember('_id') memberId: ObjectId): Promise<Notification[]> {
		console.log('Mutation: readAllNotifications');
		return await this.notificationService.readAllNotifications(memberId);
	} 
}
