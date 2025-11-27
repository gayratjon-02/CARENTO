import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { MemberService } from './member.service';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/guards/auth.guard';
import { AuthMember } from '../auth/decorators/authMember.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { MemberType } from '../../libs/enums/member.enum';
import { RolesGuard } from '../auth/guards/roles.guard';
import { WithoutGuard } from '../auth/guards/without.guard';
import type { ObjectId } from 'mongoose';
import { shapeIntoMongoObjectId } from '../../libs/config';
import { Member, Members } from '../../libs/dto/member/member';
import { AgentsInquiry, LoginInput, MemberInput } from '../../libs/dto/member/member.input';
import { MemberUpdate } from '../../libs/dto/member/member.update';


@Resolver()
export class MemberResolver {
	constructor(private readonly memberService: MemberService) {}

	// done: checkAuth
	@UseGuards(AuthGuard)
	@Query(() => String)
	public async checkAuth(@AuthMember('memberNick') memberNick: string): Promise<String> {
		console.log('Query checkAuth');
		return `${memberNick} is authenticated`;
	}

	@Roles(MemberType.USER, MemberType.AGENT)
	@UseGuards(RolesGuard)
	@Query(() => String)
	public async checkAuthRoles(@AuthMember() authMember: Member): Promise<String> {
		console.log('Query checkAuthRoles');
		return `${authMember.memberNick} is authenticated, you are ${authMember.memberType}, your memberId: ${authMember._id}`;
	}

	@Query(() => String)
	public async getCheckAuthRolesMember(): Promise<String> {
		console.log('Query checkAuthRoles');
		return this.memberService.checkAuthRoles();
	}

	// done: signup
	@Mutation(() => Member)
	public async signup(@Args('input') input: MemberInput): Promise<Member> {
		console.log('Mutation signup');
		return this.memberService.signup(input);
	}

	// done: login
	@Mutation(() => Member)
	public async login(@Args('input') input: LoginInput): Promise<Member> {
		console.log('Mutation login');
		return this.memberService.login(input);
	}

	// done: updateMember
	@UseGuards(AuthGuard)
	@Mutation(() => Member)
	public async updateMember(
		@Args('input') input: MemberUpdate,
		@AuthMember('_id') memberId: ObjectId,
	): Promise<Member> {
		console.log('Mutation: updateMember');
		return this.memberService.updateMember(input, memberId);
	}


	// done: getMember
	@UseGuards(WithoutGuard)
	@Query(() => Member)
	public async getMember(
		@Args('memberId') input: string,
		@AuthMember('_id') memberId: ObjectId, 
	): Promise<Member> {
		console.log("Query getMember");
		const targetId = shapeIntoMongoObjectId(input);

		return await this.memberService.getMember(memberId, targetId);
	}

	//Agents
	@UseGuards(WithoutGuard)
	@Query(() => Members)
	public async getAgents(@Args('input') input: AgentsInquiry, @AuthMember('_id') memberId: ObjectId): Promise<Members> {
		console.log('Query: getAgents');
		return await this.memberService.getAgents(memberId, input);
	}
}
