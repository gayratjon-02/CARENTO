import { Schema } from 'mongoose';
import { NotificationGroup, NotificationStatus, NotificationType } from '../libs/enums/notification.enum';

const NotificationSchema = new Schema(
	{
		notificationType: {
			type: String,
			enum: NotificationType,
			required: true,
		},

		notificationStatus: {
			type: String,
			enum: NotificationStatus,
			default: NotificationStatus.WAIT,
			required: true,
		},

		notificationGroup: {
			type: String,
			enum: NotificationGroup,
			required: true,
		},

		notificationTitle: {
			type: String,
			required: true,
		},

		notificationDesc: {
			type: String,
			required: true,
		},

		authorId: {
			type: Schema.Types.ObjectId,
			ref: 'Member',
			required: true,
		},

		receiverId: {
			type: Schema.Types.ObjectId,
			ref: 'MEMBER',
			required: true,
		},

		carId: {
			type: Schema.Types.ObjectId,
			ref: 'Car',
		},

		articleId: {
			type: Schema.Types.ObjectId,
			ref: 'Article',
		},
	},
	{ timestamps: true, collection: 'notifications' },
);

export default NotificationSchema;
