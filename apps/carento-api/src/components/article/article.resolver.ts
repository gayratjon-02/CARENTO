import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { ArticleService } from './article.service';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/guards/auth.guard';
import { Article } from '../../libs/dto/article/article.update';
import { ArticleInput } from '../../libs/dto/article/article.input';
import { AuthMember } from '../auth/decorators/authMember.decorator';
import { ObjectId } from 'mongoose';

@Resolver()
export class ArticleResolver {
	constructor(private readonly articleService: ArticleService) {}

	@UseGuards(AuthGuard)
	@Mutation(() => Article)
	public async createArticle(
		@Args('input') input: ArticleInput,
		@AuthMember('_id') memberId: ObjectId,
	): Promise<Article> {
		console.log('Mutation: createArticle ');
		return await this.articleService.createArticle(memberId, input);
	}
}
