import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { MemberService } from './member.service';
import { LoginInput, MemberInput } from '../../libs/dto/member.input';
import { Member } from '../../libs/dto/member';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/guards/auth.guard';
import { AuthMember } from '../auth/decorators/authMember.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { MemberType } from '../../libs/enums/member.enum';
import { RolesGuard } from '../auth/guards/roles.guard';

@Resolver()
export class MemberResolver {
	constructor(private readonly memberService: MemberService) {}

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

	// @Query(() => String)
	// public async getAgents(): Promise<String> {
	// 	console.log('Query getAgents');
	// 	return this.memberService.getAgents();
	// }

	@Mutation(() => Member)
	public async signup(@Args('input') input: MemberInput): Promise<Member> {
		console.log('Mutation signup');
		return this.memberService.signup(input);
	}

	@Mutation(() => Member)
	public async login(@Args('input') input: LoginInput): Promise<Member> {
		console.log('Mutation login');
		return this.memberService.login(input);
	}

	// @Mutation(() => String)
	// public async updateMember(): Promise<String> {
	// 	console.log('Mutation updateMember');
	// 	return this.memberService.updateMember();
	// }
	// @Query(() => String)
	// public async getMember(): Promise<String> {
	// 	console.log('Query getMember');
	// 	return this.memberService.getMember();
	// }
}
