import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { Booking, BookingsList } from '../../libs/dto/booking/booking';
import { BookingInput, BookingInquiry } from '../../libs/dto/booking/booking.input';
import { Direction, Message } from '../../libs/enums/common.enum';
import { shapeIntoMongoObjectId } from '../../libs/config';
import { T } from '../../libs/types/common';
import { BookingStatus, PaymentStatus } from '../../libs/enums/booking.enum';
import { BookingUpdate } from '../../libs/dto/booking/booking.update';

@Injectable()
export class BookingService {
	constructor(@InjectModel('Booking') private readonly bookingModel: Model<Booking>) {}

	public async createBooking(input: BookingInput, memberId: ObjectId): Promise<Booking> {
		try {
			const result = await this.bookingModel.create(input);
			if (!result) throw new BadRequestException(Message.CREATE_FAILED);
			return result;
		} catch (err) {
			console.log('Error, Booking Service createBooking', err);
			throw new BadRequestException(Message.CREATE_FAILED);
		}
	}

	// get booking
	public async getBooking(bookingId: string, memberId: ObjectId): Promise<Booking> {
		bookingId = shapeIntoMongoObjectId(bookingId);
		const result = await this.bookingModel.findOne({
			_id: bookingId,
			userId: memberId,
		});
		if (!result) throw new BadRequestException(Message.NO_DATA_FOUND);
		return result;
	}

	// getMyBookings
	public async getMyBookings(input: BookingInquiry, memberId: ObjectId): Promise<BookingsList> {
		const match: T = { userId: memberId };
		const sort: T = { [input?.sort ?? 'createdAt']: input?.direction ?? Direction.DESC };

		const result = await this.bookingModel
			.aggregate([
				{ $match: match },
				{ $sort: sort },
				{
					$facet: {
						list: [{ $skip: (input.page - 1) * input.limit }, { $limit: input.limit }],
						metaCounter: [{ $count: 'total' }],
					},
				},
			])
			.exec();

		if (!result.length || !result[0]) {
			return { list: [], metaCounter: [{ total: 0 }] };
		}

		return {
			list: result[0].list || [],
			metaCounter: result[0].metaCounter || [{ total: 0 }],
		};
	}

	// cancelBooking
	public async cancelBooking(input: ObjectId, memberId: ObjectId): Promise<Booking> {
		const result = await this.bookingModel.findOneAndUpdate(
			{
				_id: input,
				userId: memberId,
				paymentStatus: PaymentStatus.UNPAID,
				bookingStatus: BookingStatus.PENDING || BookingStatus.APPROVED,
			},
			{ $set: { bookingStatus: BookingStatus.CANCELLED, deletedAt: new Date() } },
			{ new: true },
		);
		if (!result) throw new BadRequestException(Message.CANCEL_FAILED);
		return result;
	}

	//**AGENT **/

	// getAgentBookings
	public async getAgentBookingsByAGent(input: BookingInquiry, memberId: ObjectId): Promise<BookingsList> {
		const match: T = { agentId: memberId };
		const sort: T = { [input?.sort ?? 'startDate']: input?.direction ?? Direction.DESC };

		this.shapeMatchQuery(match, input);

		const result = await this.bookingModel
			.aggregate([
				{ $match: match },
				{ $sort: sort },
				{
					$facet: {
						list: [{ $skip: (input.page - 1) * input.limit }, { $limit: input.limit }],
						metaCounter: [{ $count: 'total' }],
					},
				},
			])
			.exec();

		if (!result.length || !result[0]) {
			return { list: [], metaCounter: [{ total: 0 }] };
		}

		return {
			list: result[0].list || [],
			metaCounter: result[0].metaCounter || [{ total: 0 }],
		};
	}

	private shapeMatchQuery(match: T, input: BookingInquiry): void {
		const { paymentStatus, carStatus, bookingStatus, brandType } = input;
		if (paymentStatus) match.paymentStatus = paymentStatus;
		if (carStatus) match.carStatus = carStatus;
		if (bookingStatus) match.bookingStatus = bookingStatus;
		if (brandType) match.brandType = brandType;
	}

	// approveBooking
	public async approveBookingByAgent(bookingId: ObjectId, memberId: ObjectId): Promise<Booking> {
		const result = await this.bookingModel.findOneAndUpdate(
			{ _id: bookingId, agentId: memberId, bookingStatus: BookingStatus.PAID || BookingStatus.PENDING },
			{ $set: { bookingStatus: BookingStatus.APPROVED } },
			{ new: true },
		);
		if (!result) throw new BadRequestException(Message.APPROVE_FAILED);
		return result;
	}

	// rejectBooking
	public async rejectBookingByAgent(bookingId: ObjectId, memberId: ObjectId): Promise<Booking> {
		const result = await this.bookingModel.findOneAndUpdate(
			{ _id: bookingId, agentId: memberId, bookingStatus: BookingStatus.PAID || BookingStatus.PENDING },
			{ $set: { bookingStatus: BookingStatus.REJECTED } },
			{ new: true },
		);
		if (!result) throw new BadRequestException(Message.REJECT_FAILED);
		return result;
	}

	// ** ADMIN **
	// getAdminBookings
	public async getAdminBookingsByAdmin(input: BookingInquiry, memberId: ObjectId): Promise<BookingsList> {
		const match: T = {};
		const sort: T = { [input?.sort ?? 'startDate']: input?.direction ?? Direction.DESC };

		this.shapeMatchQuery(match, input);

		const result = await this.bookingModel
			.aggregate([
				{ $match: match },
				{ $sort: sort },
				{
					$facet: {
						list: [{ $skip: (input.page - 1) * input.limit }, { $limit: input.limit }],
						metaCounter: [{ $count: 'total' }],
					},
				},
			])
			.exec();
		return result[0];
	}

	//updateBookingByAdmin
	public async updateBookingByAdmin(input: BookingUpdate, memberId: ObjectId): Promise<Booking> {
		const result = await this.bookingModel.findOneAndUpdate(
			{ _id: input._id },
			{ $set: { bookingStatus: input.bookingStatus, paymentStatus: input.paymentStatus } },
			{ new: true },
		);
		if (!result) throw new BadRequestException(Message.UPDATE_FAILED);
		return result;
	}

	// deleteBookingByAdmin
	public async deleteBookingByAdmin(bookingId: ObjectId, memberId: ObjectId): Promise<Booking> {
		const result = await this.bookingModel.findOneAndDelete({ _id: bookingId });
		if (!result) throw new BadRequestException(Message.DELETE_FAILED);
		return result ;
	}
}
