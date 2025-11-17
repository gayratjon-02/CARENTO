import { registerEnumType } from '@nestjs/graphql';

export enum NoticeCategory {
	FAQ = 'FAQ',
	TERMS = 'TERMS',
	INQUIRY = 'INQUIRY',
}

registerEnumType(NoticeCategory, {
	name: 'NoticeCategory',
	description: 'NoticeCategory',
});

export enum NoticeStatus {
	ACTIVE = 'ACTIVE',
	DELETED = 'DELETED',
}

registerEnumType(NoticeStatus, {
	name: 'NoticeStatus',
	description: 'NoticeStatus',
});

