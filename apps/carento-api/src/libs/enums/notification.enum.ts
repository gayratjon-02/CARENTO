import { registerEnumType } from '@nestjs/graphql';

export enum NotificationType {
	LIKE = 'LIKE',
	COMMENT = 'COMMENT',
	FOLLOW = 'FOLLOW',
	MESSAGE = 'MESSAGE',
	SUBSCRIPTION = 'SUBSCRIPTION',
	
}

registerEnumType(NotificationType, {
	name: 'NotificationType',
	description: 'NotificationType',
});

export enum NotificationStatus {
	WAIT = 'WAIT',
	READ = 'READ',
}

registerEnumType(NotificationStatus, {
	name: 'NotificationStatus',
	description: 'NotificationStatus',
});

export enum NotificationGroup {
	MEMBER = 'MEMBER',
	ARTICLE = 'ARTICLE',
	CAR = 'CAR',
}

registerEnumType(NotificationGroup, {
	name: 'NotificationGroup',
	description: 'NotificationGroup',
});
