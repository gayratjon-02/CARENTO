import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { MemberService } from '../member/member.service';
import { ViewService } from '../view/view.service';
import { LikeService } from '../like/like.service';
import { ArticleInput } from '../../libs/dto/article/article.input';
import { Message } from '../../libs/enums/common.enum';
import { StatisticModifier, T } from '../../libs/types/common';
import { ArticleStatus } from '../../libs/enums/article.enum';
import { ViewGroup } from '../../libs/enums/view.enum';
import { LikeGroup } from '../../libs/enums/like.enum';
import { Article } from '../../libs/dto/article/article';
import { ArticleUpdate } from '../../libs/dto/article/article.update';

@Injectable()
export class ArticleService {
	constructor(
		@InjectModel('Article') private readonly articleModel: Model<Article>,
		private readonly memberService: MemberService,
		private readonly viewService: ViewService,
		private readonly likeService: LikeService,
	) {}

	public async createArticle(memberId: ObjectId, input: ArticleInput): Promise<Article> {
		input.memberId = memberId;
		try {
			const result = await this.articleModel.create(input);
			await this.memberService.memberStatsEditor({
				_id: memberId,
				targetKey: 'memberArticles',
				modifier: 1,
			});

			return result;
		} catch (err) {
			console.log('ErrorL , Service.model:', err.message);
			throw new BadRequestException(Message.CREATE_FAILED);
		}
	}
	// get Article

	public async getArticle(memberId: ObjectId, articleId: ObjectId): Promise<Article> {
		const search: T = {
			_id: articleId,
			articleStatus: ArticleStatus.ACTIVE,
		};

		const targetBoardArticle: Article = await this.articleModel.findOne(search).lean().exec();
		if (!targetBoardArticle) throw new InternalServerErrorException(Message.NO_DATA_FOUND);

		if (memberId) {
			const viewInput = { memberId: memberId, viewRefId: articleId, viewGroup: ViewGroup.ARTICLE };
			const newView = await this.viewService.recordView(viewInput);
			if (newView) {
				await this.articleStatsEditor({ _id: articleId, targetKey: 'articleViews', modifier: 1 });
				targetBoardArticle.articleViews++;
			}
			//meLiked
			const likeInput = { memberId: memberId, likeRefId: articleId, likeGroup: LikeGroup.ARTICLE };
			targetBoardArticle.meLiked = await this.likeService.checkLikeExistance(likeInput);
		}
		targetBoardArticle.memberData = await this.memberService.getMember(null, targetBoardArticle.memberId);
		return targetBoardArticle;
	}

	public async updateArticle(memberId: ObjectId, input: ArticleUpdate): Promise<Article> {
		const { _id, articleStatus } = input;

		const result = await this.articleModel
			.findOneAndUpdate(
				{
					_id: _id,
					memberId: memberId,
					articleStatus: ArticleStatus.ACTIVE,
				},
				input,
				{ new: true },
			)
			.exec();

		if (!result) throw new InternalServerErrorException(Message.UPLOAD_FAILED);

		if (articleStatus === ArticleStatus.DELETED) {
			await this.memberService.memberStatsEditor({
				_id: memberId,
				targetKey: 'memberArticles',
				modifier: -1,
			});
		}

		return result;
	}

	//** articleStatsEditor **/

	public async articleStatsEditor(input: StatisticModifier): Promise<Article> {
		const { _id, targetKey, modifier } = input;
		return await this.articleModel
			.findByIdAndUpdate(
				_id,
				{ $inc: { [targetKey]: modifier } },
				{
					new: true,
				},
			)
			.exec();
	}
}
