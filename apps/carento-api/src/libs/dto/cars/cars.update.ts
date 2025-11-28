import { Field, InputType, Int } from '@nestjs/graphql';
import { IsArray, IsEnum, IsInt, IsNotEmpty, IsOptional, Length, Min } from 'class-validator';
import { ObjectId } from 'mongoose';
import { BrandType, CarLocation, CarStatus, CarType, FuelType, Transmission } from '../../enums/car.enum';

@InputType()
export class CarsUpdate {
	@IsNotEmpty()
	@Field(() => String)
	_id: ObjectId;

	@IsOptional()
	@Length(3, 100)
	@Field(() => String, { nullable: true })
	carTitle?: string;

	@IsOptional()
	@Length(5, 1000)
	@Field(() => String, { nullable: true })
	carDescription?: string;

	@IsOptional()
	@IsEnum(BrandType)
	@Field(() => BrandType, { nullable: true })
	brandType?: BrandType;

	@IsOptional()
	@IsInt()
	@Min(1900)
	@Field(() => Int, { nullable: true })
	year?: number;

	@IsOptional()
	@IsEnum(FuelType)
	@Field(() => FuelType, { nullable: true })
	fuelType?: FuelType;

	@IsOptional()
	@IsEnum(Transmission)
	@Field(() => Transmission, { nullable: true })
	transmission?: Transmission;

	@IsOptional()
	@IsInt()
	@Min(1)
	@Field(() => Int, { nullable: true })
	seats?: number;

	@IsOptional()
	@IsInt()
	@Min(2)
	@Field(() => Int, { nullable: true })
	doors?: number;

	@IsOptional()
	@IsInt()
	@Min(0)
	@Field(() => Int, { nullable: true })
	mileage?: number;

	@IsOptional()
	@Length(1, 50)
	@Field(() => String, { nullable: true })
	engine?: string;

	@IsOptional()
	@IsEnum(CarType)
	@Field(() => CarType, { nullable: true })
	carType?: CarType;

	@IsOptional()
	@IsEnum(CarStatus)
	@Field(() => CarStatus, { nullable: true })
	carStatus?: CarStatus;

	@IsOptional()
	@IsEnum(CarLocation)
	@Field(() => CarLocation, { nullable: true })
	carLocation?: CarLocation;

	@IsOptional()
	@IsArray()
	@IsNotEmpty({ each: true })
	@Field(() => [String], { nullable: true })
	carImages?: string[];

	@IsOptional()
	@Min(0)
	@Field(() => Number, { nullable: true })
	pricePerDay?: number;

	@IsOptional()
	@Min(0)
	@Field(() => Number, { nullable: true })
	pricePerHour?: number;

	@IsOptional()
	@Field(() => Date, { nullable: true })
	deletedAt?: Date;
}
