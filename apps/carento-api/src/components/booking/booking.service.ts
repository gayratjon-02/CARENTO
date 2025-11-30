import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { Booking } from '../../libs/dto/booking/booking';
import { BookingInput } from '../../libs/dto/booking/booking.input';
import { Message } from '../../libs/enums/common.enum';

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
}
