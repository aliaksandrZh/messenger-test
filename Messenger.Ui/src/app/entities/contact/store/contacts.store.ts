import { Service, computed, inject } from '@angular/core';
import {
  signalStore,
  withState,
  withComputed,
  withMethods,
  withHooks,
  patchState,
} from '@ngrx/signals';
import { withEntities, setAllEntities } from '@ngrx/signals/entities';

import { UsersApiService } from '../../../shared/api/users-api.service';
import { Contact } from '../contact.model';

interface ContactsState {
  loading: boolean;
  selectedId: string | null;
}

@Service()
export class ContactsStore extends signalStore(
  withState<ContactsState>({ loading: false, selectedId: null }),
  withEntities<Contact>(),
  withComputed(({ entities, selectedId }) => ({
    contacts: computed(() => entities()),
    selectedContact: computed(() => entities().find((c) => c.id === selectedId()) ?? null),
  })),
  withMethods((store, api = inject(UsersApiService)) => ({
    loadContacts(): void {
      patchState(store, { loading: true });
      api.searchUsers('').subscribe({
        next: (contacts) => patchState(store, setAllEntities(contacts), { loading: false }),
        error: () => patchState(store, { loading: false }),
      });
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