import { OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Server } from 'ws';
import * as WebSocket from 'ws';
import { Member } from '../libs/dto/member/member';
import * as url from 'url';
import { AuthService } from '../components/auth/auth.service';
import { NotificationInput } from '../libs/dto/notification/notification.input';
import { ObjectId } from 'mongoose';

interface MessagePayload {
	event: string;
	text: string;
	memberData: Member;
}

interface InfoPayload {
	event: string;
	totalClients: number;
	memberData: Member;
	action: string;
}

@WebSocketGateway({ transports: ['websocket'], secure: false })
export class SocketGateway implements OnGatewayInit {
	private logger: Logger = new Logger('SocketEventGatewat');
	private summaryClient: number = 0;
	private clientsAuthMap = new Map<WebSocket, Member>();
	private messagesList: MessagePayload[] = [];
	private memberClientsMap = new Map<string, Set<WebSocket>>();
	constructor(private readonly authService: AuthService) {}

	@WebSocketServer()
	server: Server;

	public afterInit(server: Server) {
		this.logger.verbose(`WebSocket Server Initialized total: [${this.summaryClient}]`);
	}

	private async retrieveAuth(req: any): Promise<Member> {
		try {
			const parsedUrl = url.parse(req.url, true);
			const { token } = parsedUrl.query;
			return await this.authService.verifyToken(token as string);
		} catch (err) {
			return null;
		}
	}

	public async handleConnection(client: WebSocket, req: any) {
		const authMember = await this.retrieveAuth(req);
		this.summaryClient++;
		this.clientsAuthMap.set(client, authMember);
		this.registerClient(authMember?._id?.toString(), client);

		const clientNick: string = authMember?.memberNick ?? 'Guest';
		this.logger.verbose(`Connection ${clientNick} & total: [${this.summaryClient}]`);

		const InfoMsg: InfoPayload = {
			event: 'info',
			totalClients: this.summaryClient,
			memberData: authMember,
			action: 'joined',
		};
		this.emitMessage(InfoMsg);
		client.send(JSON.stringify({ event: 'getMessages', list: this.messagesList }));
	}

	public handleDisconnect(client: WebSocket) {
		const authMember = this.clientsAuthMap.get(client);
		this.summaryClient--;
		this.clientsAuthMap.delete(client);
		this.unregisterClient(authMember?._id?.toString(), client);

		const clientNick: string = authMember?.memberNick ?? 'Guest';
		this.logger.verbose(`Disconnection ${clientNick} & total: [${this.summaryClient}]`);

		const InfoMsg: InfoPayload = {
			event: 'info',
			totalClients: this.summaryClient,
			memberData: authMember,
			action: 'left',
		};
		this.broadCastMessage(client, InfoMsg);
	}

	@SubscribeMessage('message')
	public async handleMessage(client: WebSocket, payload: string): Promise<void> {
		const authMember = this.clientsAuthMap.get(client);
		const newMessage: MessagePayload = { event: 'message', text: payload, memberData: authMember };

		const clientNick: string = authMember?.memberNick ?? 'Guest';
		this.logger.verbose(`NEW MESSAGE:[${clientNick}]: ${payload}`);

		this.emitMessage(newMessage);

		this.messagesList.push(newMessage);
		if (this.messagesList.length > 5) this.messagesList.splice(0, this.messagesList.length - 5);
	}

	private broadCastMessage(sender: WebSocket, message: InfoPayload | MessagePayload) {
		this.server.clients.forEach((client) => {
			if (client !== sender && client.readyState === WebSocket.OPEN) {
				client.send(JSON.stringify(message));
			}
		});
	}

	private emitMessage(message: InfoPayload | MessagePayload) {
		this.server.clients.forEach((client) => {
			if (client.readyState === WebSocket.OPEN) {
				client.send(JSON.stringify(message));
			}
		});
	}

	public async sendNotification(memberId: ObjectId, notification: NotificationInput): Promise<void> {
		const clients = this.memberClientsMap.get(memberId.toString());
		if (!clients || !clients.size) {
			return;
		}
		const payload = {
			event: 'notification',
			data: notification,
		};
		clients.forEach((clientSocket) => {
			if (clientSocket.readyState === WebSocket.OPEN) {
				clientSocket.send(JSON.stringify(payload));
			}
		});
	}

	private registerClient(memberId: string | undefined, client: WebSocket) {
		if (!memberId) {
			return;
		}
		if (!this.memberClientsMap.has(memberId)) {
			this.memberClientsMap.set(memberId, new Set());
		}
		this.memberClientsMap.get(memberId)?.add(client);
	}

	private unregisterClient(memberId: string | undefined, client: WebSocket) {
		if (!memberId) {
			return;
		}
		const clients = this.memberClientsMap.get(memberId);
		if (!clients) {
			return;
		}
		clients.delete(client);
		if (!clients.size) {
			this.memberClientsMap.delete(memberId);
		}
	}
}

/** *************************************************************
 *                                                              *
 *        MESSAGE TARGET:										*
 * 1. Client (only client)										*
 * 2. Broadcast (all clients except the sender)					*
 * 3. Emit (all clients)                                        *
 * 																*
 *                                                              *
 *                                                              *
 *                                                              *
 *                                                              *
 *                                                              *
 * *************************************************************/
