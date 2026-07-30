import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

import { ChatsStore } from '../../entities/chat/store/chats.store';
import { Chat } from '../../entities/chat/chat.model';

@Component({
  selector: 'app-chat-list',
  templateUrl: './chat-list.html',
})
export class ChatList {
  protected readonly store = inject(ChatsStore);
  private readonly router = inject(Router);

  protected select(chat: Chat): void {
    this.store.selectChat(chat.id);
    void this.router.navigate(['chat', chat.id]);
  }
}