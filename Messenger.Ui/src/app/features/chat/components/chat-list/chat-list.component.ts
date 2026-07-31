import { Component, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';

import { ChatStore } from '../../../../domain/chat/chat.store';
import { Chat } from '../../../../domain/chat/chat.model';

@Component({
  selector: 'app-chat-list',
  templateUrl: './chat-list.component.html',
})
export class ChatListComponent {
  protected readonly store = inject(ChatStore);
  private readonly router = inject(Router);

  protected readonly query = signal('');
  protected readonly filtered = computed(() => {
    const q = this.query().trim().toLowerCase();
    const all = this.store.chats();
    return q ? all.filter((c) => c.name.toLowerCase().includes(q)) : all;
  });

  protected select(chat: Chat): void {
    this.store.selectChat(chat.id);
    void this.router.navigate(['chat', chat.id]);
  }
}