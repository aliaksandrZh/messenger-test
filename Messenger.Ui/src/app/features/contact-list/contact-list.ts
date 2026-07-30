import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

import { ContactsStore } from '../../entities/contact/store/contacts.store';
import { Contact } from '../../entities/contact/contact.model';

@Component({
  selector: 'app-contact-list',
  templateUrl: './contact-list.html',
})
export class ContactList {
  protected readonly store = inject(ContactsStore);
  private readonly router = inject(Router);

  protected select(contact: Contact): void {
    this.store.selectContact(contact.id);
    void this.router.navigate(['chat', contact.id]);
  }
}