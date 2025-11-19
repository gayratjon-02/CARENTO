import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class MemberService {
	constructor(@InjectModel('Member') private readonly memberModel: Model<null>) {}

	public async checkAuth(): Promise<String> {
		return 'checkAuth';
	}

	public async checkAuthRoles(): Promise<String> {
		return 'checkAuthRoles';
	}

	public async signup(): Promise<String> {
		return 'signup';
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
