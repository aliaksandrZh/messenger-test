import { Component, computed, inject } from '@angular/core';

import { MessageStore } from '../../../../domain/message/message.store';
import { ContactStore } from '../../../../domain/contact/contact.store';
import { SessionStore } from '../../../../core/session/session.store';

interface MessageRow {
  id: string;
  text: string;
  sender: string;
  senderId: string;
  time: string;
  isMine: boolean;
}

const formatTime = (iso: string): string => {
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? '' : d.toLocaleTimeString();
};

@Component({
  selector: 'app-message-list',
  templateUrl: './message-list.component.html',
  host: { class: 'block flex-auto min-h-0 overflow-auto' },
})
export class MessageListComponent {
  private readonly messages = inject(MessageStore);
  private readonly contacts = inject(ContactStore);
  private readonly session = inject(SessionStore);

  protected readonly rows = computed<MessageRow[]>(() => {
    const nameById = new Map(this.contacts.contacts().map((c) => [c.id, c.name]));
    const me = this.session.currentUserId();
    return this.messages.messages().map((m) => ({
      id: m.id,
      text: m.text,
      sender: nameById.get(m.senderId) ?? 'Unknown',
      senderId: m.senderId,
      time: formatTime(m.createdAtUtc),
      isMine: me === m.senderId,
    }));
  });
}