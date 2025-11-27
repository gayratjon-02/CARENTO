import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { CarsService } from './cars.service';
import { UseGuards } from '@nestjs/common';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { MemberType } from '../../libs/enums/member.enum';
import { Cars } from '../../libs/dto/cars/cars';
import { CarsInput } from '../../libs/dto/cars/cars.input';
import { AuthMember } from '../auth/decorators/authMember.decorator';
import { ObjectId } from 'mongoose';

@Resolver()
export class CarsResolver {
	constructor(private readonly carsService: CarsService) {}

	//Create Car

	@Roles(MemberType.AGENT)
	@UseGuards(RolesGuard)
	@Mutation(() => Cars)
	public async createCar(@Args('input') input: CarsInput, @AuthMember('_id') memberId: ObjectId): Promise<Cars> {
		console.log('Mutation: createProperty');
		input.agentId = memberId;

		return await this.carsService.createCar(input);
	}
}
