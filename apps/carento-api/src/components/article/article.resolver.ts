import { Args, Mutation, Resolver, Query } from '@nestjs/graphql';
import { ArticleService } from './article.service';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/guards/auth.guard';
import { ArticleUpdate } from '../../libs/dto/article/article.update';
import { ArticleInput, ArticlesInquiry } from '../../libs/dto/article/article.input';
import { AuthMember } from '../auth/decorators/authMember.decorator';
import { ObjectId } from 'mongoose';
import { WithoutGuard } from '../auth/guards/without.guard';
import { shapeIntoMongoObjectId } from '../../libs/config';
import { Article, Articles } from '../../libs/dto/article/article';
import { Roles } from '../auth/decorators/roles.decorator';
import { MemberType } from '../../libs/enums/member.enum';
import { RolesGuard } from '../auth/guards/roles.guard';

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
	public async updateArticle(
		@Args('input') input: ArticleUpdate,
		@AuthMember('_id') memberId: ObjectId,
	): Promise<Article> {
		console.log('Mutation: updateArticle ');
		input._id = shapeIntoMongoObjectId(input._id);
		return await this.articleService.updateArticle(memberId, input);
	}

	// get Articles
	@UseGuards(WithoutGuard)
	@Query(() => Articles)
	public async getArticles(
		@Args('input') input: ArticlesInquiry,
		@AuthMember('_id') memberId: ObjectId,
	): Promise<Articles> {
		console.log('Query: getArticles ');
		return await this.articleService.getArticles(memberId, input);
	}

	//** LIKE **/

	@UseGuards(AuthGuard)
	@Mutation(() => Article)
	public async likeTargetArticle(
		@Args('articleId') input: string,
		@AuthMember('_id') memberId: ObjectId,
	): Promise<Article> {
		console.log('Mutation: likeTargetArticle');
		const likeRefId = shapeIntoMongoObjectId(input);
		return await this.articleService.likeTargetArticle(memberId, likeRefId);
	}

	/** ADMIN **/

	@Roles(MemberType.ADMIN)
	@UseGuards(RolesGuard)
	@Query(() => Articles)
	public async getAllArticlesByAdmin(
		@Args('input') input: ArticlesInquiry,
		@AuthMember('_id') memberId: ObjectId,
	): Promise<Articles> {
		console.log('Query: getAllArticlesByAdmin ');
		return await this.articleService.getAllArticlesByAdmin(input);
	}

	@Roles(MemberType.ADMIN)
	@UseGuards(RolesGuard)
	@Mutation(() => Article)
	public async updateArticleByAdmin(
		@Args('input') input: ArticleUpdate,
		@AuthMember('_id') memberId: ObjectId,
	): Promise<Article> {
		console.log('Mutation: updateArticleByAdmin ');
		input._id = shapeIntoMongoObjectId(input._id);
		return await this.articleService.updateArticleByAdmin(input);
	}

	@Roles(MemberType.ADMIN)
	@UseGuards(RolesGuard)
	@Mutation(() => Article)
	public async removeArticleByAdmin(
		@Args('articleId') input: string,
		@AuthMember('_id') memberId: ObjectId,
	): Promise<Article> {
		console.log('Mutation: removeBoardArticleByAdmin ');
		const articleId = shapeIntoMongoObjectId(input);
		return await this.articleService.removeArticleByAdmin(articleId);
	}
}
