import { Field, InputType, Int } from '@nestjs/graphql';
import { IsEnum, IsIn, IsNotEmpty, IsOptional, Length, Max, Min } from 'class-validator';
import { ObjectId } from 'mongoose';
import { NotificationGroup, NotificationStatus, NotificationType } from '../../enums/notification.enum';
import { Direction } from '../../enums/common.enum';
import { availableNotificationSorts } from '../../config';

@InputType()
export class NotificationInput {
	@IsNotEmpty()
	@IsEnum(NotificationType)
	@Field(() => NotificationType)
	notificationType: NotificationType;

	@IsNotEmpty()
	@IsEnum(NotificationGroup)
	@Field(() => NotificationGroup)
	notificationGroup: NotificationGroup;

	@IsNotEmpty()
	@Length(1, 200)
	@Field(() => String)
	notificationTitle: string;

	@IsNotEmpty()
	@Length(1, 500)
	@Field(() => String)
	notificationDesc: string;

	@IsOptional()
	@Field(() => String, { nullable: true })
	authorId?: ObjectId;

	@IsNotEmpty()
	@Field(() => String)
	receiverId: ObjectId;

	@IsOptional()
	@Field(() => String, { nullable: true })
	carId?: ObjectId;

	@IsOptional()
	@Field(() => String, { nullable: true })
	articleId?: ObjectId;

	@IsOptional()
	@IsEnum(NotificationStatus)
	@Field(() => NotificationStatus, { nullable: true })
	notificationStatus?: NotificationStatus;
}

@InputType()
class NotificationSearch {
	@IsOptional()
	@IsEnum(NotificationType)
	@Field(() => NotificationType, { nullable: true })
	notificationType?: NotificationType;

	@IsOptional()
	@IsEnum(NotificationGroup)
	@Field(() => NotificationGroup, { nullable: true })
	notificationGroup?: NotificationGroup;

	@IsOptional()
	@IsEnum(NotificationStatus)
	@Field(() => NotificationStatus, { nullable: true })
	notificationStatus?: NotificationStatus;
}

@InputType()
export class NotificationsInquiry {
	@IsOptional()
	@Min(1)
	@Field(() => Int, { nullable: true, defaultValue: 1 })
	page?: number;

	@IsOptional()
	@Min(1)
	@Max(50)
	@Field(() => Int, { nullable: true, defaultValue: 10 })
	limit?: number;

	@IsOptional()
	@IsIn(availableNotificationSorts)
	@Field(() => String, { nullable: true })
	sort?: string;

	@IsOptional()
	@IsEnum(Direction)
	@Field(() => Direction, { nullable: true })
	direction?: Direction;

	@IsOptional()
	@Field(() => NotificationSearch, { nullable: true })
	search?: NotificationSearch;
}
