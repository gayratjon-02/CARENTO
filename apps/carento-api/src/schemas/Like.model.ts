import { Schema } from 'mongoose';
import { LikeGroup } from '../libs/enums/like.enum';

const LikeSchema = new Schema(
	{
		likeGroup: {
			type: String,
			enum: LikeGroup,
			required: true,
		},

		likeRefId: {
			type: Schema.Types.ObjectId,
			required: true,
		},

		memberId: {
			type: Schema.Types.ObjectId,
			ref: 'Member',
			required: true,
		},
	},
	{ timestamps: true, collection: 'likes' },
);
LikeSchema.index({ likeRefId: 1, memberId: 1 }, { unique: true });

export default LikeSchema;
