import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Member } from '../../libs/dto/member';
import { MemberInput } from '../../libs/dto/member.input';
import { Message } from '../../libs/enums/common.enum';

@Injectable()
export class MemberService {
	constructor(@InjectModel('Member') private readonly memberModel: Model<Member>) {}

	public async checkAuth(): Promise<String> {
		return 'checkAuth';
	}

	public async checkAuthRoles(): Promise<String> {
		return 'checkAuthRoles';
	}

	public async signup(input: MemberInput): Promise<Member> {
		// input.memberPassword = await this.authService.hashPassword(input.memberPassword);

		try {
			const result = await this.memberModel.create(input);
			// result.accessToken = await this.authService.createToken(result);
			return result;
		} catch (err) {
			console.log('Error, Service.model', err.message);
			throw new BadRequestException(Message.USED_MEMBER_NICK_OR_PHONE);
		}
	}

	public async login(): Promise<String> {
		return 'login';
	}

	public async updateMember(): Promise<String> {
		return 'updateMember';
	}

	public async getMember(): Promise<String> {
		return 'getMember';
	}

	public async getAgents(): Promise<String> {
		return 'getAgents';
	}
}
