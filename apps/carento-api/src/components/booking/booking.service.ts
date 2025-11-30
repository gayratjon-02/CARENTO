import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { Booking, BookingsList } from '../../libs/dto/booking/booking';
import { BookingInput, BookingInquiry } from '../../libs/dto/booking/booking.input';
import { Direction, Message } from '../../libs/enums/common.enum';
import { shapeIntoMongoObjectId } from '../../libs/config';
import { T } from '../../libs/types/common';
import { BookingStatus, PaymentStatus } from '../../libs/enums/booking.enum';

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
		);
		if (!result) throw new BadRequestException(Message.CANCEL_FAILED);
		return result;
	}

	//**AGENT **/

	// getAgentBookings
	public async getAgentBookingsByAGent(input: BookingInquiry, memberId: ObjectId): Promise<BookingsList> {
		const match: T = { agentId: memberId };
		const sort: T = { [input?.sort ?? 'startDate']: input?.direction ?? Direction.DESC };

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
}
