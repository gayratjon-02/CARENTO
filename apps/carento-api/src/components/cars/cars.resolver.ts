import { Args, Mutation, Resolver , Query} from '@nestjs/graphql';
import { CarsService } from './cars.service';
import { UseGuards } from '@nestjs/common';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { MemberType } from '../../libs/enums/member.enum';
import { Car } from '../../libs/dto/cars/cars';
import { CarsInput } from '../../libs/dto/cars/cars.input';
import { AuthMember } from '../auth/decorators/authMember.decorator';
import { ObjectId } from 'mongoose';
import { WithoutGuard } from '../auth/guards/without.guard';
import { shapeIntoMongoObjectId } from '../../libs/config';

@Resolver()
export class CarsResolver {
	constructor(private readonly carsService: CarsService) {}

	//Create Car

	@Roles(MemberType.AGENT)
	@UseGuards(RolesGuard)
	@Mutation(() => Car)
	public async createCar(@Args('input') input: CarsInput, @AuthMember('_id') memberId: ObjectId): Promise<Car> {
		console.log('Mutation: createProperty');
		input.memberId = memberId;

		return await this.carsService.createCar(input);
	}

	// GET Car
	@UseGuards(WithoutGuard)
	@Query(() => Car)
	public async getCar(
		@Args('carId') input: string,
		@AuthMember('_id') memberId: ObjectId,
	): Promise<Car> {
		console.log('Query: getCar');
		const carId = shapeIntoMongoObjectId(input);
		return await this.carsService.getCar(memberId, carId);
	}
}
