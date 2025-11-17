import { registerEnumType } from '@nestjs/graphql';

export enum BookingStatus {
	PENDING = 'PENDING',
	APPROVED = 'APPROVED',
	REJECTED = 'REJECTED',
	ACTIVE = 'ACTIVE',
	COMPLETED = 'COMPLETED',
	CANCELLED = 'CANCELLED',
}

registerEnumType(BookingStatus, {
	name: 'BookingStatus',
	description: 'BookingStatus',
});

export enum PaymentStatus {
	UNPAID = 'UNPAID',
	PAID = 'PAID',
	REFUNDED = 'REFUNDED',
}

registerEnumType(PaymentStatus, {
	name: 'PaymentStatus',
	description: 'PaymentStatus',
});
