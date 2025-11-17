import { registerEnumType } from '@nestjs/graphql';

export enum LikeGroup {
	CAR = 'CAR',
	ARTICLE = 'ARTICLE',
	COMMENT = 'COMMENT',
}

registerEnumType(LikeGroup, {
	name: 'LikeGroup',
	description: 'LikeGroup',
});

