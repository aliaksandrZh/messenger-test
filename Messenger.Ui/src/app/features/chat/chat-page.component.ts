import { Component, effect, inject } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';

import { ChatListComponent } from './components/chat-list/chat-list.component';
import { NewChatComponent } from './components/new-chat/new-chat.component';
import { ChatStore } from '../../domain/chat/chat.store';
import { SessionStore } from '../../core/session/session.store';

@Component({
  selector: 'app-chat-page',
  imports: [RouterOutlet, ChatListComponent, NewChatComponent],
  templateUrl: './chat-page.component.html',
  host: { class: 'block h-full' },
})
export class ChatPage {
  private readonly chatsStore = inject(ChatStore);
  private readonly session = inject(SessionStore);
  private readonly router = inject(Router);

  // React to a freshly created chat and navigate to it. Lives in an injection
  // context, so the effect is auto-disposed with this component.
  private readonly navigateOnCreated = effect(() => {
    const id = this.chatsStore.createdChatId();
    if (id) void this.router.navigate(['chat', id]);
  });

  constructor() {
    // Guard guarantees a current user before this page is reached.
    const userId = this.session.currentUserId();
    if (userId) void this.chatsStore.loadMyChats(userId);
  }

  createChat(name: string): void {
    this.chatsStore.createChat(name);
  }
}