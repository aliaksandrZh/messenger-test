import { Component, computed, inject, signal } from '@angular/core';

import { ContactStore } from '../../../../domain/contact/contact.store';
import { ChatFeatureStore } from '../../chat.store';

@Component({
  selector: 'app-invite-panel',
  templateUrl: './invite-panel.component.html',
})
export class InvitePanelComponent {
  private readonly contacts = inject(ContactStore);
  private readonly chat = inject(ChatFeatureStore);

  protected readonly query = signal('');
  protected readonly filtered = computed(() => {
    const q = this.query().trim().toLowerCase();
    const all = this.contacts.contacts();
    return q ? all.filter((c) => c.name.toLowerCase().includes(q)) : all;
  });

  protected invite(userId: string): void {
    this.chat.inviteUser(userId);
  }
}