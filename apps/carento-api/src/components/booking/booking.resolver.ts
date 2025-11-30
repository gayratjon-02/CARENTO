import { Args, Mutation, Resolver, Query } from '@nestjs/graphql';
import { BookingService } from './booking.service';
import { InternalServerErrorException, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/guards/auth.guard';
import { BookingInput, BookingInquiry } from '../../libs/dto/booking/booking.input';
import { AuthMember } from '../auth/decorators/authMember.decorator';
import { ObjectId } from 'mongoose';
import { Member } from '../../libs/dto/member/member';
import { MemberType } from '../../libs/enums/member.enum';
import { Message } from '../../libs/enums/common.enum';
import { Booking, BookingsList } from '../../libs/dto/booking/booking';

@Resolver()
export class BookingResolver {
	constructor(private readonly bookingService: BookingService) {}

	// creae booking
	@Mutation(() => Booking)
	@UseGuards(AuthGuard)
	public async createBooking(@Args('input') input: BookingInput, @AuthMember() member: Member): Promise<Booking> {
		console.log('Mutation: createBooking');
		if (member.memberType !== MemberType.USER) throw new InternalServerErrorException(Message.ONLY_USERS_ALLOWED);

		console.log(typeof input.userId, input.carId);
		input.userId = member._id;
		return await this.bookingService.createBooking(input, member._id);
	}

	// get booking
	@UseGuards(AuthGuard)
	@Query(() => Booking)
	public async getBooking(@Args('input') input: string, @AuthMember('_id') memberId: ObjectId): Promise<Booking> {
		console.log('Query: getBooking');
		return await this.bookingService.getBooking(input, memberId);
	}

    // getMyBookings
    @UseGuards(AuthGuard)
    @Query(() => BookingsList)
    public async getMyBookings(@Args('input') input: BookingInquiry, @AuthMember('_id') memberId: ObjectId): Promise<BookingsList> {
        console.log('Query: getMyBookings');
        return await this.bookingService.getMyBookings(input, memberId);
    }

}
