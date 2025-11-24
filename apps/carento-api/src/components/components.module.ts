import { Module } from '@nestjs/common';
import { MemberModule } from './member/member.module';
import { CarsModule } from './cars/cars.module';
import { AuthModule } from './auth/auth.module';
import { CommentModule } from './comment/comment.module';
import { LikeModule } from './like/like.module';
import { ViewModule } from './view/view.module';
import { FollowModule } from './follow/follow.module';
import { ArticleModule } from './article/article.module';
import { BookingModule } from './booking/booking.module';
import { NoticeModule } from './notice/notice.module';
import { NotificationModule } from './notification/notification.module';

@Module({
	imports: [
		MemberModule,
		CarsModule,
		AuthModule,
		CommentModule,
		LikeModule,
		ViewModule,
		FollowModule,
		ArticleModule,
		BookingModule,
		NoticeModule,
		NotificationModule,
	],
})
export class ComponentsModule {}
