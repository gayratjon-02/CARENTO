import { registerEnumType } from '@nestjs/graphql';

export enum NoticeCategory {
	GENERAL = 'GENERAL',
	ANNOUNCEMENT = 'ANNOUNCEMENT',
	UPDATE = 'UPDATE',
	WARNING = 'WARNING',
}

registerEnumType(NoticeCategory, {
	name: 'NoticeCategory',
	description: 'NoticeCategory',
});

export enum NoticeStatus {
	ACTIVE = 'ACTIVE',
	INACTIVE = 'INACTIVE',
	DELETED = 'DELETED',
}

registerEnumType(NoticeStatus, {
	name: 'NoticeStatus',
	description: 'NoticeStatus',
});

