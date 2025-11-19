import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { MemberService } from './member.service';
import { UsePipes, ValidationPipe } from '@nestjs/common';
import { LoginInput, MemberInput } from '../../libs/dto/member.input';
import { Member } from '../../libs/dto/member';

@Resolver()
export class MemberResolver {
	constructor(private readonly memberService: MemberService) {}

	@Query(() => String)
	public async checkAuth(): Promise<String> {
		console.log('Query checkAuth');
		return this.memberService.checkAuth();
	}

	@Query(() => String)
	public async getMcheckAuthRolesember(): Promise<String> {
		console.log('Query checkAuthRoles');
		return this.memberService.checkAuthRoles();
	}

	@Query(() => String)
	public async getAgents(): Promise<String> {
		console.log('Query getAgents');
		return this.memberService.getAgents();
	}

	@Mutation(() => Member)
	@UsePipes(ValidationPipe)
	public async signup(@Args('input') input: MemberInput): Promise<Member> {
		console.log('Mutation signup');
		return this.memberService.signup(input);
	}

	@Mutation(() => String)
	public async login(@Args('input') input: LoginInput): Promise<String> {
		console.log('Mutation login');
		return this.memberService.login();
	}

	@Mutation(() => String)
	public async updateMember(): Promise<String> {
		console.log('Mutation updateMember');
		return this.memberService.updateMember();
	}
	@Query(() => String)
	public async getMember(): Promise<String> {
		console.log('Query getMember');
		return this.memberService.getMember();
	}
}
