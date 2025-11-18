import { Injectable } from '@nestjs/common';

@Injectable()
export class MemberService {
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
