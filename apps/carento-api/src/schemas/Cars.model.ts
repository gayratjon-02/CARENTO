import { Schema } from 'mongoose';
import { BrandType, CarStatus, CarType, FuelType, Transmission } from '../libs/enums/car.enum';

const CarsSchema = new Schema(
	{
		carTitle: {
			type: String,
			required: true,
		},

		carDescription: {
			type: String,
		},

		agentId: {
			type: Schema.Types.ObjectId,
			ref: 'members',
			required: true,
		},

		brandType: {
			type: String,
			enum: BrandType,
			required: true,
		},

		year: {
			type: Number,
			required: true,
		},

		fuelType: {
			type: String,
			enum: FuelType,
			required: true,
		},

		transmission: {
			type: String,
			enum: Transmission,
			required: true,
		},

		seats: {
			type: Number,
			required: true,
		},

		doors: {
			type: Number,
			required: true,
		},

		mileage: {
			type: Number,
			required: true,
		},

		engine: {
			type: String,
		},

		carType: {
			type: String,
			enum: CarType,
			required: true,
		},

		carStatus: {
			type: String,
			enum: CarStatus,
			default: CarStatus.AVAILABLE,
			required: true,
		},

		carLocation: {
			type: String,
			required: true,
		},

		carImages: {
			type: [String],
			default: [],
			required: true,
		},

		pricePerDay: {
			type: Number,
		},

		pricePerHour: {
			type: Number,
		},

		carViews: {
			type: Number,
			default: 0,
		},

		deletedAt: {
			type: Date,
		},
	},
	{ timestamps: true, collection: 'cars' },
);

CarsSchema.index({ carTitle: 'text', carDescription: 'text', carLocation: 'text' });

export default CarsSchema;

