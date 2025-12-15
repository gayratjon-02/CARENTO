import { Field, InputType, Int } from '@nestjs/graphql';
import { IsArray, IsEnum, IsIn, IsInt, IsNotEmpty, IsOptional, Length, Min } from 'class-validator';
import { ObjectId } from 'mongoose';
import { BrandType, CarLocation, CarStatus, CarType, FuelType, Transmission } from '../../enums/car.enum';
import { Direction } from '../../enums/common.enum';
import { availableAgentSorts, availableCarSorts, availableOptions } from '../../config';

@InputType()
export class CarsInput {
	@IsNotEmpty()
	@Length(3, 100)
	@Field(() => String)
	carTitle: string;

	@IsOptional()
	@Length(5, 1000)
	@Field(() => String, { nullable: true })
	carDescription?: string;

	memberId?: ObjectId;

	@IsNotEmpty()
	@IsEnum(BrandType)
	@Field(() => BrandType)
	brandType: BrandType;

	@IsNotEmpty()
	@IsInt()
	@Min(1900)
	@Field(() => Int)
	year: number;

	@IsNotEmpty()
	@IsEnum(FuelType)
	@Field(() => FuelType)
	fuelType: FuelType;

	@IsNotEmpty()
	@IsEnum(Transmission)
	@Field(() => Transmission)
	transmission: Transmission;

	@IsNotEmpty()
	@IsInt()
	@Min(1)
	@Field(() => Int)
	seats: number;

	@IsNotEmpty()
	@IsInt()
	@Min(2)
	@Field(() => Int)
	doors: number;

	@IsNotEmpty()
	@IsInt()
	@Min(0)
	@Field(() => Int)
	mileage: number;

	@IsOptional()
	@Length(1, 50)
	@Field(() => String, { nullable: true })
	engine?: string;

	@IsNotEmpty()
	@IsEnum(CarType)
	@Field(() => CarType)
	carType: CarType;

	@IsOptional()
	@IsEnum(CarStatus)
	@Field(() => CarStatus, { nullable: true })
	carStatus?: CarStatus;

	@IsNotEmpty()
	@Field(() => CarLocation)
	carLocation: CarLocation;

	@IsNotEmpty()
	@IsArray()
	@IsNotEmpty({ each: true })
	@Field(() => [String])
	carImages: string[];

	@IsNotEmpty()
	@Min(0)
	@Field(() => Number)
	pricePerDay: number;

	@IsNotEmpty()
	@Min(0)
	@Field(() => Number)
	pricePerHour: number;
}

@InputType()
export class PricesRange {
	@Field(() => Int)
	start: number;

	@Field(() => Int)
	end: number;
}

@InputType()
export class CarsSearch {
	@IsOptional()
	@Field(() => String, { nullable: true })
	memberId?: ObjectId;

	@IsOptional()
	@IsArray()
	@Field(() => [CarLocation], { nullable: true })
	carLocation?: CarLocation[];

	@IsOptional()
	@IsArray()
	@IsEnum(CarType, { each: true })
	@Field(() => [CarType], { nullable: true })
	carType?: CarType[];

	@IsOptional()
	@Field(() => [BrandType], { nullable: true })
	brandType?: BrandType[];

	@IsOptional()
	@Field(() => [FuelType], { nullable: true })
	fuelType?: FuelType[];

	@IsOptional()
	@Field(() => [Transmission], { nullable: true })
	transmission?: Transmission[];

	@IsOptional()
	@Field(() => [Int], { nullable: true })
	seats?: number[];

	@IsOptional()
	@Field(() => [Int], { nullable: true })
	year?: number[];

	@IsOptional()
	@Field(() => PricesRange, { nullable: true })
	pricePerDay?: PricesRange;

	@IsOptional()
	@Field(() => PricesRange, { nullable: true })
	pricePerHour?: PricesRange;

	@IsOptional()
	@Field(() => PricesRange, { nullable: true })
	mileage?: PricesRange;

	@IsOptional()
	@Field(() => String, { nullable: true })
	text?: string;
}

@InputType()
export class CISearch {
	@IsOptional()
	@Field(() => String, { nullable: true })
	memberId?: ObjectId;

	@IsOptional()
	@Field(() => [CarLocation], { nullable: true })
	carLocation?: CarLocation[];

	@IsOptional()
	@Field(() => [CarType], { nullable: true })
	carType?: CarType[];

	@IsOptional()
	@Field(() => [BrandType], { nullable: true })
	brandType?: BrandType[];

	@IsOptional()
	@Field(() => [FuelType], { nullable: true })
	fuelType?: FuelType[];

	@IsOptional()
	@Field(() => [Transmission], { nullable: true })
	transmission?: Transmission[];

	@IsOptional()
	@Field(() => [Int], { nullable: true })
	seats?: number[];

	@IsOptional()
	@Field(() => [Int], { nullable: true })
	doors?: number[];

	@IsOptional()
	@Field(() => [Int], { nullable: true })
	year?: number[];

	@IsOptional()
	@Field(() => PricesRange, { nullable: true })
	pricePerDay?: PricesRange;

	@IsOptional()
	@Field(() => PricesRange, { nullable: true })
	pricePerHour?: PricesRange;

	@IsOptional()
	@Field(() => PricesRange, { nullable: true })
	mileage?: PricesRange;

	@IsOptional()
	@Field(() => String, { nullable: true })
	engine?: string;

	@IsOptional()
	@Field(() => String, { nullable: true })
	text?: string;
}

@InputType()
export class CarsInquiry {
	@IsNotEmpty()
	@Min(1)
	@Field(() => Int)
	page: number;

	@IsNotEmpty()
	@Min(1)
	@Field(() => Int)
	limit: number;

	@IsOptional()
	@IsIn(availableCarSorts)
	@Field(() => String, { nullable: true })
	sort?: string;

	@IsOptional()
	@IsEnum(Direction)
	@Field(() => Direction, { nullable: true })
	direction?: Direction;

	@IsNotEmpty()
	@Field(() => CarsSearch)
	search: CISearch;
}

@InputType()
class AgentCarsSearch {
	@IsOptional()
	@IsEnum(CarStatus)
	@Field(() => CarStatus, { nullable: true })
	carStatus?: CarStatus;
}

@InputType()
export class AgentCarsInquiry {
	@IsNotEmpty()
	@Min(1)
	@Field(() => Int)
	page: number;

	@IsNotEmpty()
	@Min(1)
	@Field(() => Int)
	limit: number;

	@IsOptional()
	@IsIn(availableAgentSorts)
	@Field(() => String, { nullable: true })
	sort?: string;

	@IsOptional()
	@IsEnum(Direction)
	@Field(() => Direction, { nullable: true })
	direction?: Direction;

	@IsNotEmpty()
	@Field(() => AgentCarsSearch)
	search: AgentCarsSearch;
}

@InputType()
class AllCarsSearch {
	@IsOptional()
	@IsEnum(CarStatus)
	@Field(() => CarStatus, { nullable: true })
	carStatus?: CarStatus;

	@IsOptional()
	@IsArray()
	@Field(() => [CarLocation], { nullable: true })
	carLocation?: CarLocation[];
}

@InputType()
export class AllCarsInquiry {
	@IsNotEmpty()
	@Min(1)
	@Field(() => Int)
	page: number;

	@IsNotEmpty()
	@Min(1)
	@Field(() => Int)
	limit: number;

	@IsOptional()
	@IsIn(availableAgentSorts)
	@Field(() => String, { nullable: true })
	sort?: string;

	@IsOptional()
	@IsEnum(Direction)
	@Field(() => Direction, { nullable: true })
	direction?: Direction;

	@IsOptional()
	@Field(() => AllCarsSearch, { nullable: true })
	search?: AllCarsSearch;
}

@InputType()
export class OrdinaryInquiry {
	@IsNotEmpty()
	@Min(1)
	@Field(() => Int)
	page: number;

	@IsNotEmpty()
	@Min(1)
	@Field(() => Int)
	limit: number;
}
