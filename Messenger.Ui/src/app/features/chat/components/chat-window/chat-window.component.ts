import { Component, OnDestroy, effect, inject, input } from '@angular/core';

import { MessageListComponent } from '../message-list/message-list.component';
import { MessageInputComponent } from '../message-input/message-input.component';
import { InvitePanelComponent } from '../invite-panel/invite-panel.component';
import { ChatLayoutComponent } from '../chat-layout/chat-layout.component';
import { ChatFeatureStore } from '../../chat.store';

@Component({
  selector: 'app-chat-window',
  imports: [MessageListComponent, MessageInputComponent, InvitePanelComponent, ChatLayoutComponent],
  templateUrl: './chat-window.component.html',
  host: { class: 'block flex-auto min-w-0 border-l border-gray-300' },
})
export class ChatWindow implements OnDestroy {
  readonly chatId = input<string>();

  protected readonly chat = inject(ChatFeatureStore);

  // On chat selection (route param): load history + join the hub group.
  private readonly openEffect = effect(() => {
    const id = this.chatId();
    if (id) this.chat.openChat(id);
  });

  ngOnDestroy(): void {
    this.chat.leaveActiveChat();
  }
}