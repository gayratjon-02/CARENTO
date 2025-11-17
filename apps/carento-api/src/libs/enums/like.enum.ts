import { registerEnumType } from '@nestjs/graphql';

export enum LikeGroup {
	CAR = 'CAR',
	ARTICLE = 'ARTICLE',
	MEMBER = 'MEMBER',
}

registerEnumType(LikeGroup, {
	name: 'LikeGroup',
	description: 'LikeGroup',
});

