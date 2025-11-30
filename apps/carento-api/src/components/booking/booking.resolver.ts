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
import { shapeIntoMongoObjectId } from '../../libs/config';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { BookingUpdate } from '../../libs/dto/booking/booking.update';

@Resolver()
export class BookingResolver {
	constructor(private readonly bookingService: BookingService) {}

	// creae booking
	@Mutation(() => Booking)
	@UseGuards(AuthGuard)

	//** USER BOOKINGS **/
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
	public async getMyBookings(
		@Args('input') input: BookingInquiry,
		@AuthMember('_id') memberId: ObjectId,
	): Promise<BookingsList> {
		console.log('Query: getMyBookings');
		return await this.bookingService.getMyBookings(input, memberId);
	}

	// cancelBooking
	@UseGuards(AuthGuard)
	@Mutation(() => Booking)
	public async cancelBooking(@Args('input') input: string, @AuthMember('_id') memberId: ObjectId): Promise<Booking> {
		console.log('Mutation: cancelBooking');
		return await this.bookingService.cancelBooking(shapeIntoMongoObjectId(input), memberId);
	}

	//** AGENT **/

	// getAgentBookings
	@Roles(MemberType.AGENT)
	@UseGuards(RolesGuard)
	@Query(() => BookingsList)
	public async getAgentBookingsByAGent(
		@Args('input') input: BookingInquiry,
		@AuthMember('_id') memberId: ObjectId,
	): Promise<BookingsList> {
		console.log('Query: getAgentBookingsByAGent');
		console.log('step1');
		return await this.bookingService.getAgentBookingsByAGent(input, memberId);
	}
    

    // approveBooking
    @Roles(MemberType.AGENT)
    @UseGuards(RolesGuard)
    @Mutation(() => Booking)
    public async approveBookingByAgent(@Args('input') input: string, @AuthMember('_id') memberId: ObjectId): Promise<Booking> {
        console.log('Mutation: approveBookingByAgent');
        const bookingId = shapeIntoMongoObjectId(input);
        return await this.bookingService.approveBookingByAgent(bookingId, memberId);
    }

    // rejectBooking
    @Roles(MemberType.AGENT)
    @UseGuards(RolesGuard)
    @Mutation(() => Booking)
    public async rejectBookingByAgent(@Args('input') input: string, @AuthMember('_id') memberId: ObjectId): Promise<Booking> {
        console.log('Mutation: rejectBookingByAgent');
        const bookingId = shapeIntoMongoObjectId(input);
        return await this.bookingService.rejectBookingByAgent(bookingId, memberId);
    }

    //** ADMIN **/

    // getAdminBookings
    @Roles(MemberType.ADMIN)
    @UseGuards(RolesGuard)
    @Query(() => BookingsList)
    public async getAdminBookingsByAdmin(@Args('input') input: BookingInquiry, @AuthMember('_id') memberId: ObjectId): Promise<BookingsList> {
        console.log('Query: getAdminBookingsByAdmin');
        return await this.bookingService.getAdminBookingsByAdmin(input, memberId);
    }

    //updateBookingByAdmin
    @Roles(MemberType.ADMIN)
    @UseGuards(RolesGuard)
    @Mutation(() => Booking)
    public async updateBookingByAdmin(@Args('input') input: BookingUpdate, @AuthMember('_id') memberId: ObjectId): Promise<Booking> {
        console.log('Mutation: updateBookingByAdmin');
        return await this.bookingService.updateBookingByAdmin(input, memberId);
    }
}
