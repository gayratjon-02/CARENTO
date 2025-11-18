import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';

@Injectable()
export class MemberService {
	constructor(private readonly memberModel: Model<null>) {}
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
}
