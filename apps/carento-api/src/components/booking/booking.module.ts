import { Module } from '@nestjs/common';
import { BookingResolver } from './booking.resolver';
import { BookingService } from './booking.service';
import BookingSchema from '../../schemas/Booking.model';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from '../auth/auth.module';

@Module({
	imports: [MongooseModule.forFeature([{ name: 'Booking', schema: BookingSchema }]),AuthModule],

	providers: [BookingResolver, BookingService],
  exports: [BookingService],
})
export class BookingModule {}
