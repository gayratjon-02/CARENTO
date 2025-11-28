import { Args, Mutation, Resolver, Query } from '@nestjs/graphql';
import { ArticleService } from './article.service';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/guards/auth.guard';
import {  ArticleUpdate } from '../../libs/dto/article/article.update';
import { ArticleInput } from '../../libs/dto/article/article.input';
import { AuthMember } from '../auth/decorators/authMember.decorator';
import { ObjectId } from 'mongoose';
import { WithoutGuard } from '../auth/guards/without.guard';
import { shapeIntoMongoObjectId } from '../../libs/config';
import { Article } from '../../libs/dto/article/article';

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
	// get Article

	@UseGuards(WithoutGuard)
	@Query(() => Article)
	public async getArticle(@Args('articleId') input: string, @AuthMember('_id') memberId: ObjectId): Promise<Article> {
		console.log('Query: getArticle ');
		const articleId = shapeIntoMongoObjectId(input);
		return await this.articleService.getArticle(memberId, articleId);
	}

	// update Article
	@UseGuards(AuthGuard)
	@Mutation(() => Article)
	public async updateArticle(@Args('input') input: ArticleUpdate, @AuthMember('_id') memberId: ObjectId): Promise<Article> {
		console.log('Mutation: updateArticle ');
		input._id = shapeIntoMongoObjectId(input._id);
		return await this.articleService.updateArticle(memberId, input);
	}
}
