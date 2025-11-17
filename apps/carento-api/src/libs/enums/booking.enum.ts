import { registerEnumType } from '@nestjs/graphql';

export enum BookingStatus {
	PENDING = 'PENDING',
	CONFIRMED = 'CONFIRMED',
	ACTIVE = 'ACTIVE',
	COMPLETED = 'COMPLETED',
	CANCELLED = 'CANCELLED',
}

registerEnumType(BookingStatus, {
	name: 'BookingStatus',
	description: 'BookingStatus',
});

export enum PaymentStatus {
	PENDING = 'PENDING',
	PAID = 'PAID',
	REFUNDED = 'REFUNDED',
	FAILED = 'FAILED',
}

registerEnumType(PaymentStatus, {
	name: 'PaymentStatus',
	description: 'PaymentStatus',
});

