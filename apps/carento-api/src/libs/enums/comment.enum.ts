import { registerEnumType } from '@nestjs/graphql';

export enum CommentGroup {
	CAR = 'CAR',
	ARTICLE = 'ARTICLE',
	COMMENT = 'COMMENT',
}

registerEnumType(CommentGroup, {
	name: 'CommentGroup',
	description: 'CommentGroup',
});

export enum CommentStatus {
	ACTIVE = 'ACTIVE',
	DELETED = 'DELETED',
	BLOCKED = 'BLOCKED',
}

registerEnumType(CommentStatus, {
	name: 'CommentStatus',
	description: 'CommentStatus',
});

