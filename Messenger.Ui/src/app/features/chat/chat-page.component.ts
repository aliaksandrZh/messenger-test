import { Component, computed, inject } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';

import { ChatListComponent } from './components/chat-list/chat-list.component';
import { NewChatComponent } from './components/new-chat/new-chat.component';
import { ChatStore } from '../../domain/chat/chat.store';
import { ContactStore } from '../../domain/contact/contact.store';
import { SessionStore } from '../../core/session/session.store';

@Component({
  selector: 'app-chat-page',
  imports: [RouterOutlet, ChatListComponent, NewChatComponent],
  templateUrl: './chat-page.component.html',
  host: { class: 'block h-full' },
})
export class ChatPage {
  private readonly chatsStore = inject(ChatStore);
  private readonly contacts = inject(ContactStore);
  private readonly session = inject(SessionStore);
  private readonly router = inject(Router);

  protected readonly currentUserName = computed(() => {
    const id = this.session.currentUserId();
    if (!id) return '';
    return this.contacts.contacts().find((c) => c.id === id)?.name ?? '';
  });

  protected readonly initials = computed(() => {
    const name = this.currentUserName().trim();
    if (!name) return '?';
    const parts = name.split(/\s+/);
    return (parts[0]?.[0] ?? '') + (parts[1]?.[0] ?? '');
  });

  constructor() {
    // Guard guarantees a current user before this page is reached.
    const userId = this.session.currentUserId();
    if (userId) void this.chatsStore.loadMyChats(userId);
  }

  protected goToNewChat(): void {
    void this.router.navigate(['new']);
  }
}