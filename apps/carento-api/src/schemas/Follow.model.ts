import { Schema } from 'mongoose';

const FollowSchema = new Schema(
	{
		followingId: {
			type: Schema.Types.ObjectId,
			ref: 'members',
			required: true,
		},

		followerId: {
			type: Schema.Types.ObjectId,
			ref: 'members',
			required: true,
		},
	},
	{ timestamps: true, collection: 'follows' },
);

export default FollowSchema;

