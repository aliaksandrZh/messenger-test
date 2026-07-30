import { Service, inject, signal } from '@angular/core';
import {
  HubConnection,
  HubConnectionBuilder,
  HubConnectionState,
} from '@microsoft/signalr';
import { Subject } from 'rxjs';

import { SIGNALR_HUB_URL } from '../config/config';
import { Message } from '../../entities/message/message.model';

@Service()
export class ChatHubService {
  private connection?: HubConnection;

  readonly state = signal<HubConnectionState>(HubConnectionState.Disconnected);
  readonly messages$ = new Subject<Message>();
  readonly userJoined$ = new Subject<{ chatId: string; userId: string }>();
  readonly userLeft$ = new Subject<{ chatId: string; userId: string }>();

  async start(): Promise<void> {
    if (this.connection && this.connection.state !== HubConnectionState.Disconnected) {
      return;
    }

    this.connection = new HubConnectionBuilder()
      .withUrl(SIGNALR_HUB_URL)
      .withAutomaticReconnect()
      .build();

    this.connection.on('ReceiveMessage', (message: Message) => this.messages$.next(message));
    this.connection.on('UserJoined', (chatId: string, userId: string) =>
      this.userJoined$.next({ chatId, userId }),
    );
    this.connection.on('UserLeft', (chatId: string, userId: string) =>
      this.userLeft$.next({ chatId, userId }),
    );

    this.connection.onreconnecting(() => this.state.set(HubConnectionState.Reconnecting));
    this.connection.onreconnected(() => this.state.set(HubConnectionState.Connected));
    this.connection.onclose(() => this.state.set(HubConnectionState.Disconnected));

    await this.connection.start();
    this.state.set(this.connection.state);
  }

  async stop(): Promise<void> {
    if (!this.connection) return;
    await this.connection.stop();
    this.connection = undefined;
  }

  async joinChatAsync(chatId: string, userId: string): Promise<void> {
    await this.ensureStarted();
    await this.connection!.invoke('JoinChatAsync', chatId, userId);
  }

  async leaveChatAsync(chatId: string): Promise<void> {
    if (!this.connection) return;
    await this.connection.invoke('LeaveChatAsync', chatId);
  }

  async sendMessageAsync(chatId: string, text: string): Promise<void> {
    await this.ensureStarted();
    await this.connection!.invoke('SendMessageAsync', chatId, text);
  }

  private async ensureStarted(): Promise<void> {
    if (!this.connection || this.connection.state === HubConnectionState.Disconnected) {
      await this.start();
    }
  }
}