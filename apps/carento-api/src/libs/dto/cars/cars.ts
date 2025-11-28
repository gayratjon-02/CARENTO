import { Field, Int, ObjectType } from '@nestjs/graphql';
import type { ObjectId } from 'mongoose';
import { BrandType, CarLocation, CarStatus, CarType, FuelType, Transmission } from '../../enums/car.enum';
import { Member, TotalCounter } from '../member/member';
import { MeLiked } from '../like/like';

@ObjectType()
export class Car {
	@Field(() => String)
	_id: ObjectId;

	@Field(() => String)
	carTitle: string;

	memberId?: ObjectId;

	@Field(() => String, { nullable: true })
	carDescription?: string;

	@Field(() => BrandType)
	brandType: BrandType;

	@Field(() => Int)
	year: number;

	@Field(() => FuelType, { nullable: true })
	fuelType?: FuelType;

	@Field(() => Transmission, { nullable: true })
	transmission?: Transmission;

	@Field(() => Int)
	seats: number;

	@Field(() => Int)
	doors: number;

	@Field(() => Int)
	mileage: number;

	@Field(() => String, { nullable: true })
	engine?: string;

	@Field(() => CarType)
	carType: CarType;

	@Field(() => CarStatus)
	carStatus: CarStatus;

	@Field(() => CarLocation)
	carLocation: CarLocation;

	@Field(() => [String])
	carImages: string[];

	@Field(() => Number, { nullable: true })
	pricePerDay?: number;

	@Field(() => Number, { nullable: true })
	pricePerHour?: number;


	@Field(() => Number, { nullable: true })
	carLikes?: number;

	@Field(() => Int, { nullable: true })
	carViews?: number;

	@Field(() => Date, { nullable: true })
	deletedAt?: Date;

	@Field(() => Date)
	createdAt: Date;

	@Field(() => Date)
	updatedAt: Date;

	//** from aggregation **/

	@Field(() => [MeLiked], { nullable: true })
	meLiked?: MeLiked[];

	@Field(() => Member, { nullable: true })
	memberData?: Member;
}

@ObjectType()
export class CarsList {
	@Field(() => [Car])
	list: Car[];

	@Field(() => [TotalCounter], { nullable: true })
	metaCounter: TotalCounter[];
}
