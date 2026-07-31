import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

import { ContactStore } from '../../domain/contact/contact.store';
import { SessionStore } from '../../core/session/session.store';
import { Contact } from '../../domain/contact/contact.model';

@Component({
  selector: 'app-user-select',
  templateUrl: './user-select.component.html',
})
export class UserSelectComponent {
  protected readonly contactsStore = inject(ContactStore);
  private readonly sessionStore = inject(SessionStore);
  private readonly router = inject(Router);

  protected select(user: Contact): void {
    this.sessionStore.setCurrentUser(user.id);
    void this.router.navigate(['']);
  }
}