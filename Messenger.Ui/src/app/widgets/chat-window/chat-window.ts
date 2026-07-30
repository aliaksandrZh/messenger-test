import { Component, OnDestroy, computed, effect, inject, input } from '@angular/core';

import { MessageList } from '../../features/message-list/message-list';
import { MessageInput } from '../../features/message-input/message-input';
import { MessagesStore } from '../../entities/message/store/messages.store';
import { ContactsStore } from '../../entities/contact/store/contacts.store';
import { ChatHubService } from '../../shared/signalr/chat-hub.service';
import { CURRENT_USER_ID } from '../../shared/config/config';

@Component({
  selector: 'app-chat-window',
  imports: [MessageList, MessageInput],
  templateUrl: './chat-window.html',
  host: { class: 'block flex-auto min-w-0 border-l border-gray-300' },
})
export class ChatWindow implements OnDestroy {
  readonly contactId = input<string>();

  private readonly messagesStore = inject(MessagesStore);
  private readonly contactsStore = inject(ContactsStore);
  private readonly hub = inject(ChatHubService);

  // Push incoming SignalR messages into the store for the active chat.
  private readonly subscription = this.hub.messages$.subscribe((message) => {
    if (message.chatId === this.contactId()) {
      this.messagesStore.addMessage(message);
    }
  });

  // On chat selection (route param): load history + join the hub group.
  // NOTE: on param-only changes Angular reuses this component, so leaveChat
  // for the previous chat is not handled here yet (placeholder).
  private readonly joinEffect = effect(() => {
    const chatId = this.contactId();
    if (!chatId) return;

    this.messagesStore.loadMessages(chatId);
    void this.hub.joinChatAsync(chatId, CURRENT_USER_ID);
  });

  readonly header = computed(() => {
    const id = this.contactId();
    const contact = this.contactsStore.contacts().find((c) => c.id === id);
    return contact ? contact.name : `Chat ${id ?? ''}`;
  });

  ngOnDestroy(): void {
    const chatId = this.contactId();
    if (chatId) {
      void this.hub.leaveChatAsync(chatId);
    }
    this.subscription.unsubscribe();
  }
}