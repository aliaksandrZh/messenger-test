import { Component, inject } from '@angular/core';

import { MessagesStore } from '../../entities/message/store/messages.store';

@Component({
  selector: 'app-message-list',
  templateUrl: './message-list.html',
  host: { class: 'block flex-auto min-h-0 overflow-auto' },
})
export class MessageList {
  protected readonly store = inject(MessagesStore);
}