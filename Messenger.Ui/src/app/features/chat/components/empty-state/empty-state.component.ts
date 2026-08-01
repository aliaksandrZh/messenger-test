import { Component, effect, inject } from '@angular/core';
import { Router } from '@angular/router';

import { ChatStore } from '../../../../domain/chat/chat.store';


@Component({
  selector: 'app-empty-state',
  templateUrl: './empty-state.component.html',
  host: { class: 'block flex-auto min-w-0 border-l border-gray-300' },
})
export class EmptyStateComponent {
  private readonly chats = inject(ChatStore);
  private readonly router = inject(Router);

  protected readonly hasChats = this.chats.chats;

  private readonly redirectOnChats = effect(() => {
    const first = this.chats.chats()[0];
    if (first) void this.router.navigate(['chat', first.id]);
  });

  protected goToNewChat(): void {
    void this.router.navigate(['new']);
  }
}