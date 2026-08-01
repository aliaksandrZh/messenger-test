import { Component, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';

import { ChatLayoutComponent } from '../chat-layout/chat-layout.component';
import { ChatStore } from '../../../../domain/chat/chat.store';
import { ContactStore } from '../../../../domain/contact/contact.store';
import { SessionStore } from '../../../../core/session/session.store';

@Component({
  selector: 'app-new-chat-view',
  imports: [ChatLayoutComponent],
  templateUrl: './new-chat-view.component.html',
  host: { class: 'block flex-auto min-w-0 border-l border-gray-300' },
})
export class NewChatViewComponent {
  private readonly chats = inject(ChatStore);
  private readonly contacts = inject(ContactStore);
  private readonly session = inject(SessionStore);
  private readonly router = inject(Router);

  protected readonly selectedIds = signal<ReadonlySet<string>>(new Set());
  protected readonly nameTouched = signal(false);
  protected readonly name = signal('');

  protected readonly selectableContacts = computed(() => {
    const me = this.session.currentUserId();
    return this.contacts.contacts().filter((c) => c.id !== me);
  });

  protected readonly defaultName = computed(() => {
    const ids = this.selectedIds();
    const all = this.contacts.contacts();
    const names = all.filter((c) => ids.has(c.id)).map((c) => c.name);
    return names.join(', ');
  });

  protected readonly creating = computed(() => this.chats.creating());

  protected onNameInput(value: string): void {
    this.nameTouched.set(true);
    this.name.set(value);
  }

  protected toggleContact(id: string): void {
    this.selectedIds.update((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
    if (!this.nameTouched()) {
      this.name.set(this.defaultName());
    }
  }

  protected isSelected(id: string): boolean {
    return this.selectedIds().has(id);
  }

  protected async create(): Promise<void> {
    const ids = [...this.selectedIds()];
    let name = this.name().trim();
    if (!name) name = `New chat ${this.chats.chats().length + 1}`;
    await this.chats.createChatWithContacts(name, ids);
    // Read the id here instead of in an effect: a stale `createdChatId` would
    // re-fire on re-entry and bounce the user out of this view.
    const createdId = this.chats.createdChatId();
    if (createdId) void this.router.navigate(['chat', createdId]);
  }
}