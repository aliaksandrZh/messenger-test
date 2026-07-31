import { Injectable, inject, signal } from '@angular/core';
import {
  HubConnection,
  HubConnectionBuilder,
  HubConnectionState,
} from '@microsoft/signalr';
import { Subject } from 'rxjs';

import { Logger } from '../logging/logger.service';
import { SIGNALR_HUB_URL } from '../config/config';
import { ChatHubMessage } from './chat-hub.model';
import { HubError, HubOperation } from './chat-hub.errors';

@Injectable({ providedIn: 'root' })
export class ChatHubService {
  private readonly logger = inject(Logger);
  private connection?: HubConnection;

  readonly state = signal<HubConnectionState>(HubConnectionState.Disconnected);
  readonly messages$ = new Subject<ChatHubMessage>();
  readonly userJoined$ = new Subject<{ chatId: string; userId: string }>();
  readonly userLeft$ = new Subject<{ chatId: string; userId: string }>();
  /** Observable hub failures so the feature layer can surface them to the UI. */
  readonly errors$ = new Subject<HubError>();

  async start(): Promise<void> {
    if (this.connection && this.connection.state !== HubConnectionState.Disconnected) {
      return;
    }

    this.connection = new HubConnectionBuilder()
      .withUrl(SIGNALR_HUB_URL)
      .withAutomaticReconnect()
      .build();

    this.connection.on('ReceiveMessage', (message: ChatHubMessage) => this.messages$.next(message));
    this.connection.on('UserJoined', (chatId: string, userId: string) =>
      this.userJoined$.next({ chatId, userId }),
    );
    this.connection.on('UserLeft', (chatId: string, userId: string) =>
      this.userLeft$.next({ chatId, userId }),
    );

    this.connection.onreconnecting((err) => {
      this.state.set(HubConnectionState.Reconnecting);
      this.logger.error('ChatHub', 'reconnecting', err);
      this.emitError('reconnect', 'Reconnect attempt failed', err);
    });
    this.connection.onreconnected(() => this.state.set(HubConnectionState.Connected));
    this.connection.onclose((err) => {
      this.state.set(HubConnectionState.Disconnected);
      if (err) {
        // Permanent reconnect failure (withAutomaticReconnect exhausted) lands here.
        this.logger.error('ChatHub', 'closed with error', err);
        this.emitError('reconnect', 'Connection closed and will not reconnect', err);
      }
    });

    try {
      await this.connection.start();
      this.state.set(this.connection.state);
    } catch (err) {
      this.state.set(HubConnectionState.Disconnected);
      this.logger.error('ChatHub', 'start failed', err);
      this.emitError('start', 'Failed to start hub connection', err);
      throw err;
    }
  }

  async stop(): Promise<void> {
    if (!this.connection) return;
    try {
      await this.connection.stop();
    } catch (err) {
      // Best-effort shutdown: log + emit, but never crash the app on teardown.
      this.logger.error('ChatHub', 'stop failed', err);
      this.emitError('stop', 'Failed to stop hub connection', err);
      return;
    }
    this.connection = undefined;
  }

  async joinChatAsync(chatId: string, userId: string): Promise<void> {
    await this.ensureStarted();
    try {
      await this.connection!.invoke('JoinChatAsync', chatId, userId);
    } catch (err) {
      this.logger.error('ChatHub', 'join failed', err);
      this.emitError('join', `Failed to join chat ${chatId}`, err, chatId);
      throw err;
    }
  }

  async leaveChatAsync(chatId: string): Promise<void> {
    if (!this.connection) return;
    try {
      await this.connection.invoke('LeaveChatAsync', chatId);
    } catch (err) {
      // Best-effort leave: surface but do not rethrow.
      this.logger.error('ChatHub', 'leave failed', err);
      this.emitError('leave', `Failed to leave chat ${chatId}`, err, chatId);
    }
  }

  async sendMessageAsync(chatId: string, text: string): Promise<void> {
    await this.ensureStarted();
    try {
      await this.connection!.invoke('SendMessageAsync', chatId, text);
    } catch (err) {
      this.logger.error('ChatHub', 'sendMessage failed', err);
      this.emitError('sendMessage', `Failed to send message to chat ${chatId}`, err, chatId);
      throw err;
    }
  }

  private async ensureStarted(): Promise<void> {
    if (!this.connection || this.connection.state === HubConnectionState.Disconnected) {
      await this.start();
    }
  }

  private emitError(operation: HubOperation, message: string, err: unknown, chatId?: string): void {
    const error = err instanceof Error ? err : err == null ? undefined : new Error(String(err));
    this.errors$.next({ operation, message, error, chatId, timestamp: Date.now() });
  }
}