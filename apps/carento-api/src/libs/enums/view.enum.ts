import { registerEnumType } from '@nestjs/graphql';

export enum ViewGroup {
	ARTICLE = 'ARTICLE',
	MEMBER = 'MEMBER',
	CAR = 'CAR',

}

registerEnumType(ViewGroup, {
	name: 'ViewGroup',
	description: 'ViewGroup',
});

