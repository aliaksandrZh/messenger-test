import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

import { ContactsStore } from '../../entities/contact/store/contacts.store';
import { SessionStore } from '../../shared/session/session.store';
import { Contact } from '../../entities/contact/contact.model';

@Component({
  selector: 'app-user-select',
  templateUrl: './user-select.html',
})
export class UserSelect {
  protected readonly contactsStore = inject(ContactsStore);
  private readonly sessionStore = inject(SessionStore);
  private readonly router = inject(Router);

  protected select(user: Contact): void {
    this.sessionStore.setCurrentUser(user.id);
    void this.router.navigate(['']);
  }
}