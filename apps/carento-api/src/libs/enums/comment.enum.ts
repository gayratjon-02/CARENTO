import { registerEnumType } from '@nestjs/graphql';

export enum CommentGroup {
	MEMBER = 'MEMBER',
	ARTICLE = 'ARTICLE',
	CARS = 'CARS',
}

registerEnumType(CommentGroup, {
	name: 'CommentGroup',
	description: 'CommentGroup',
});

export enum CommentStatus {
	ACTIVE = 'ACTIVE',
	DELETED = 'DELETED',
}

registerEnumType(CommentStatus, {
	name: 'CommentStatus',
	description: 'CommentStatus',
});

