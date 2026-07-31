import { Injectable, computed, inject } from '@angular/core';
import { signalStore, withState, withMethods, patchState } from '@ngrx/signals';

import { ChatHubService } from '../../core/signalr/chat-hub.service';
import { HubError } from '../../core/signalr/chat-hub.errors';
import { SessionStore } from '../../core/session/session.store';
import { MessageStore } from '../../domain/message/message.store';
import { ChatStore } from '../../domain/chat/chat.store';

/**
 * Feature-local state for the chat experience: owns the active-chat lifecycle
 * (load history, join/leave the hub group) and routes incoming SignalR messages
 * into the shared MessageStore. Kept out of the component so ChatWindow stays
 * presentational. `hubError` mirrors the latest hub failure emitted on
 * `ChatHubService.errors$` so the UI can show a banner instead of dropping it.
 */
interface ChatFeatureState {
  activeChatId: string | null;
  showInvite: boolean;
  hubError: HubError | null;
}

@Injectable({ providedIn: 'root' })
export class ChatFeatureStore extends signalStore(
  withState<ChatFeatureState>({ activeChatId: null, showInvite: false, hubError: null }),
  withMethods(
    (store,
      hub = inject(ChatHubService),
      session = inject(SessionStore),
      messages = inject(MessageStore),
      chats = inject(ChatStore)) => ({
      openChat(chatId: string): void {
        const previous = store.activeChatId();
        if (previous && previous !== chatId) void hub.leaveChatAsync(previous);
        patchState(store, { activeChatId: chatId, showInvite: false, hubError: null });
        messages.loadMessages(chatId);
        const userId = session.currentUserId();
        if (userId) void hub.joinChatAsync(chatId, userId);
      },
      leaveActiveChat(): void {
        const chatId = store.activeChatId();
        if (chatId) void hub.leaveChatAsync(chatId);
        patchState(store, { activeChatId: null, showInvite: false });
        messages.clearMessages();
      },
      toggleInvite(): void {
        patchState(store, { showInvite: !store.showInvite() });
      },
      inviteUser(userId: string): void {
        const chatId = store.activeChatId();
        if (!chatId) return;
        void chats.invite(chatId, [userId]);
      },
      setHubError(error: HubError | null): void {
        patchState(store, { hubError: error });
      },
    }),
  ),
) {
  private readonly hub = inject(ChatHubService);
  private readonly messages = inject(MessageStore);
  private readonly chats = inject(ChatStore);

  readonly header = computed(() => {
    const id = this.activeChatId();
    const chat = this.chats.chats().find((c) => c.id === id);
    return chat ? chat.name : `Chat ${id ?? ''}`;
  });

  // Route incoming SignalR messages into the message store for the active chat.
  private readonly messageSubscription = this.hub.messages$.subscribe((message) => {
    if (message.chatId === this.activeChatId()) {
      this.messages.addMessage(message);
    }
  });

  // Surface hub failures (start/join/send/reconnect/...) on state so the UI can
  // render a banner instead of the errors being dropped by fire-and-forget calls.
  private readonly errorSubscription = this.hub.errors$.subscribe((error) => {
    this.setHubError(error);
  });
}