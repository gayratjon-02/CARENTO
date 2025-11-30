import { Field, ObjectType } from "@nestjs/graphql";
import { ObjectId } from "mongoose";
import { BookingStatus, PaymentStatus } from "../../enums/booking.enum";


@ObjectType()
export class Booking{
    @Field(() => String)
    _id: ObjectId;

    @Field(() => String)
    userId: ObjectId;

    @Field(() => String)
    agentId: ObjectId;

    @Field(() => String)
    carId: ObjectId;

    @Field(() => Date)
    startDate: Date;

    @Field(() => Date)
    endDate: Date;

    @Field(() => Number)
    totalPrice: number;

    @Field(() => BookingStatus)
    bookingStatus?: BookingStatus ;

    @Field(() => PaymentStatus)
    paymentStatus?: PaymentStatus;

    @Field(() => Date)
    createdAt: Date;

	@Field(() => Date)
	updatedAt?: Date;

	@Field(() => Date, { nullable: true })
	deletedAt?: Date;
}