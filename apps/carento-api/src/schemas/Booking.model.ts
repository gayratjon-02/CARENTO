import { Schema } from 'mongoose';
import { BookingStatus, PaymentStatus } from '../libs/enums/booking.enum';

const BookingSchema = new Schema(
	{
		userId: {
			type: Schema.Types.ObjectId,
			ref: 'members',
			required: true,
		},

		agentId: {
			type: Schema.Types.ObjectId,
			ref: 'members',
			required: true,
		},

		carId: {
			type: Schema.Types.ObjectId,
			ref: 'cars',
			required: true,
		},

		startDate: {
			type: Date,
			required: true,
		},

		endDate: {
			type: Date,
			required: true,
		},

		totalPrice: {
			type: Number,
			required: true,
		},

		bookingStatus: {
			type: String,
			enum: BookingStatus,
			default: BookingStatus.PENDING,
			required: true,
		},

		paymentStatus: {
			type: String,
			enum: PaymentStatus,
			default: PaymentStatus.PENDING,
			required: true,
		},
	},
	{ timestamps: true, collection: 'bookings' },
);

export default BookingSchema;

