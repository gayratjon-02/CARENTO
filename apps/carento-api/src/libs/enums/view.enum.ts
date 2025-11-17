import { registerEnumType } from '@nestjs/graphql';

export enum ViewGroup {
	CAR = 'CAR',
	ARTICLE = 'ARTICLE',
	MEMBER = 'MEMBER',
}

registerEnumType(ViewGroup, {
	name: 'ViewGroup',
	description: 'ViewGroup',
});

