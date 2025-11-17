import { registerEnumType } from '@nestjs/graphql';

export enum MemberType {
	USER = 'USER',
	AGENT = 'AGENT',
	ADMIN = 'ADMIN',
}

registerEnumType(MemberType, {
	name: 'MemberType',
	description: 'MemberType',
});

export enum MemberStatus {
	ACTIVE = 'ACTIVE',
	BLOCKED = 'BLOCKED',
	DELETED = 'DELETED',
}

registerEnumType(MemberStatus, {
	name: 'MemberStatus',
	description: 'MemberStatus',
});

export enum MemberAuthType {
	PHONE = 'PHONE',
	EMAIL = 'EMAIL',
	TELEGRAM = 'TELEGRAM',
    GOOGLE = 'GOOGLE',
}

registerEnumType(MemberAuthType, {
	name: 'memberAuthType',
	description: 'memberAuthType',
});
