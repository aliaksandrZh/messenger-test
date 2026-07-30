import { Component, OnDestroy, computed, effect, inject, input, signal } from '@angular/core';

import { MessageList } from '../../features/message-list/message-list';
import { MessageInput } from '../../features/message-input/message-input';
import { MessagesStore } from '../../entities/message/store/messages.store';
import { ContactsStore } from '../../entities/contact/store/contacts.store';
import { ChatsStore } from '../../entities/chat/store/chats.store';
import { ChatHubService } from '../../shared/signalr/chat-hub.service';
import { SessionStore } from '../../shared/session/session.store';

@Component({
  selector: 'app-chat-window',
  imports: [MessageList, MessageInput],
  templateUrl: './chat-window.html',
  host: { class: 'block flex-auto min-w-0 border-l border-gray-300' },
})
export class ChatWindow implements OnDestroy {
  readonly contactId = input<string>();

  private readonly messagesStore = inject(MessagesStore);
  protected readonly contactsStore = inject(ContactsStore);
  private readonly chatsStore = inject(ChatsStore);
  private readonly session = inject(SessionStore);
  private readonly hub = inject(ChatHubService);

  protected readonly showInvite = signal(false);

  // Push incoming SignalR messages into the store for the active chat.
  private readonly subscription = this.hub.messages$.subscribe((message) => {
    if (message.chatId === this.contactId()) {
      this.messagesStore.addMessage(message);
    }
  });

  // On chat selection (route param): load history + join the hub group.
  private readonly joinEffect = effect(() => {
    const chatId = this.contactId();
    if (!chatId) return;

    this.messagesStore.loadMessages(chatId);
    const userId = this.session.currentUserId();
    if (userId) void this.hub.joinChatAsync(chatId, userId);
  });

  readonly header = computed(() => {
    const id = this.contactId();
    const chat = this.chatsStore.chats().find((c) => c.id === id);
    return chat ? chat.name : `Chat ${id ?? ''}`;
  });

  protected toggleInvite(): void {
    this.showInvite.update((v) => !v);
  }

  protected invite(userId: string): void {
    const chatId = this.contactId();
    if (!chatId) return;
    void this.chatsStore.invite(chatId, [userId]);
  }

  ngOnDestroy(): void {
    const chatId = this.contactId();
    if (chatId) {
      void this.hub.leaveChatAsync(chatId);
    }
    this.subscription.unsubscribe();
  }
}