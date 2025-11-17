import { Schema } from 'mongoose';
import { ArticleCategory, ArticleStatus } from '../libs/enums/article.enum';

const ArticleSchema = new Schema(
	{
		articleCategory: {
			type: String,
			enum: ArticleCategory,
			required: true,
		},

		articleStatus: {
			type: String,
			enum: ArticleStatus,
			default: ArticleStatus.ACTIVE,
		},

		articleTitle: {
			type: String,
			required: true,
		},

		articleContent: {
			type: String,
			required: true,
		},

		articleImage: {
			type: String,
			default: '',
		},

		articleLikes: {
			type: Number,
			default: 0,
		},

		articleViews: {
			type: Number,
			default: 0,
		},

		articleComments: {
			type: Number,
			default: 0,
		},

		memberId: {
			type: Schema.Types.ObjectId,
			ref: 'Member',
			required: true,
		},
	},
	{ timestamps: true, collection: 'Articles' },
);

export default ArticleSchema;
