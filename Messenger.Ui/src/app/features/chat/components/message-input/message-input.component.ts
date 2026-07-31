import { Component, inject, input, signal } from '@angular/core';

import { ChatHubService } from '../../../../core/signalr/chat-hub.service';

@Component({
  selector: 'app-message-input',
  templateUrl: './message-input.component.html',
  host: { class: 'block border-t border-gray-300' },
})
export class MessageInputComponent {
  readonly chatId = input<string>();

  private readonly hub = inject(ChatHubService);
  protected readonly text = signal('');

  protected send(): void {
    const chatId = this.chatId();
    const value = this.text().trim();
    if (!chatId || !value) return;

    void this.hub.sendMessageAsync(chatId, value);
    this.text.set('');
  }
}