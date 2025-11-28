import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { Article } from '../../libs/dto/article/article.update';
import { MemberService } from '../member/member.service';
import { ViewService } from '../view/view.service';
import { LikeService } from '../like/like.service';
import { ArticleInput } from '../../libs/dto/article/article.input';
import { Message } from '../../libs/enums/common.enum';

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
}
