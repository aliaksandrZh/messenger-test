import { Injectable, computed, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import {
  signalStore,
  withState,
  withComputed,
  withMethods,
  withHooks,
  patchState,
} from '@ngrx/signals';
import { withEntities, setAllEntities } from '@ngrx/signals/entities';

import { ContactService } from './contact.service';
import { Contact } from './contact.model';

interface ContactState {
  loading: boolean;
  selectedId: string | null;
}

@Injectable({ providedIn: 'root' })
export class ContactStore extends signalStore(
  withState<ContactState>({ loading: false, selectedId: null }),
  withEntities<Contact>(),
  withComputed(({ entities, selectedId }) => ({
    contacts: computed(() => entities()),
    selectedContact: computed(() => entities().find((c) => c.id === selectedId()) ?? null),
  })),
  withMethods((store, api = inject(ContactService)) => ({
    async loadContacts(): Promise<void> {
      patchState(store, { loading: true });
      try {
        const contacts = await firstValueFrom(api.searchUsers(''));
        patchState(store, setAllEntities(contacts), { loading: false });
      } catch (err) {
        patchState(store, { loading: false });
        throw err;
      }
    },
    selectContact(id: string): void {
      patchState(store, { selectedId: id });
    },
  })),
  withHooks({
    onInit(store) {
      store.loadContacts();
    },
  }),
) {}