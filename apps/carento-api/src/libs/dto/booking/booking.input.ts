import { Field, InputType } from '@nestjs/graphql';
import { ObjectId } from 'mongoose';
import { BookingStatus } from '../../enums/booking.enum';
import { IsNotEmpty, IsOptional } from 'class-validator';

@InputType()
export class BookingInput {
	@IsNotEmpty()
	@Field(() => String)
	userId: ObjectId;

	@IsNotEmpty()
	@Field(() => String)
	agentId: ObjectId;

	@Field(() => String)
	carId: ObjectId;

	@IsNotEmpty()
	@Field(() => Date)
	startDate: Date;

	@IsNotEmpty()
	@Field(() => Date)
	endDate: Date;

	@IsNotEmpty()
	@Field(() => Number)
	totalPrice: number;

	@IsOptional()
	@Field(() => BookingStatus, { nullable: true })
	bookingStatus?: BookingStatus;
}
