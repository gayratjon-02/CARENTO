import { registerEnumType } from '@nestjs/graphql';

export enum NotificationType {
	BOOKING = 'BOOKING',
	LIKE = 'LIKE',
	COMMENT = 'COMMENT',
	FOLLOW = 'FOLLOW',
	MESSAGE = 'MESSAGE',
	SYSTEM = 'SYSTEM',
}

registerEnumType(NotificationType, {
	name: 'NotificationType',
	description: 'NotificationType',
});

export enum NotificationStatus {
	UNREAD = 'UNREAD',
	READ = 'READ',
	DELETED = 'DELETED',
}

registerEnumType(NotificationStatus, {
	name: 'NotificationStatus',
	description: 'NotificationStatus',
});

export enum NotificationGroup {
	BOOKING = 'BOOKING',
	ARTICLE = 'ARTICLE',
	CAR = 'CAR',
	MEMBER = 'MEMBER',
}

registerEnumType(NotificationGroup, {
	name: 'NotificationGroup',
	description: 'NotificationGroup',
});

