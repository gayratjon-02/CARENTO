import { Field, InputType } from "@nestjs/graphql";
import { ObjectId } from "mongoose";
import { IsNotEmpty, IsOptional } from "class-validator";
import { BookingStatus, PaymentStatus } from "../../enums/booking.enum";

@InputType()
export class BookingUpdate {
	@IsNotEmpty()
	@Field(() => String)
	_id: string;

	@IsOptional()
	@Field(() => BookingStatus, { nullable: true })
	bookingStatus?: BookingStatus;

	@IsOptional()
	@Field(() => PaymentStatus, { nullable: true })
	paymentStatus?: PaymentStatus;
}       