import { Field, InputType, Int } from '@nestjs/graphql';
import { ObjectId } from 'mongoose';
import { BookingStatus } from '../../enums/booking.enum';
import { IsEnum, IsIn, IsNotEmpty, IsOptional, Min } from 'class-validator';
import { availableBookingSorts } from '../../config';
import { Direction } from '../../enums/common.enum';

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

@InputType()
export class BookingInquiry {
	@IsNotEmpty()
	@Min(1)
	@Field(() => Int)
	page: number;

	@IsNotEmpty()
	@Min(1)
	@Field(() => Int)
	limit: number;

	@IsOptional()
	@IsIn(availableBookingSorts)
	@Field(() => String, { nullable: true })
	sort?: string;

	@IsOptional()
	@IsEnum(Direction)
	@Field(() => Direction, { nullable: true })
	direction?: Direction;
}
