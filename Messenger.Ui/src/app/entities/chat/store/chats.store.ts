import { Service, computed, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { signalStore, withState, withComputed, withMethods, patchState } from '@ngrx/signals';
import { withEntities, setAllEntities } from '@ngrx/signals/entities';

import { ChatsApiService } from '../../../shared/api/chats-api.service';
import { SessionStore } from '../../../shared/session/session.store';
import { Chat } from '../chat.model';

interface ChatsState {
  creating: boolean;
  error: string | null;
  createdChatId: string | null;
  selectedChatId: string | null;
}

@Service()
export class ChatsStore extends signalStore(
  withState<ChatsState>({
    creating: false,
    error: null,
    createdChatId: null,
    selectedChatId: null,
  }),
  withEntities<Chat>(),
  withComputed(({ entities, selectedChatId }) => ({
    chats: computed(() => entities()),
    selectedChat: computed(() => entities().find((c) => c.id === selectedChatId()) ?? null),
  })),
  withMethods((store, api = inject(ChatsApiService)) => ({
    async loadMyChats(userId: string) {
      try {
        const chats = await firstValueFrom(api.getMyChats(userId));
        patchState(store, setAllEntities(chats));
      } catch (err) {
        throw err;
      }
    },
    selectChat(id: string): void {
      patchState(store, { selectedChatId: id });
    },
    async invite(chatId: string, userIds: string[]) {
      try {
        await firstValueFrom(api.invite(chatId, userIds));
      } catch (err) {
        throw err;
      }
    },
  })),
  withMethods((store, api = inject(ChatsApiService), session = inject(SessionStore)) => ({
    async createChat(name: string) {
      const userId = session.currentUserId();
      if (!userId) throw new Error('No current user selected.');
      patchState(store, { creating: true, error: null });
      try {
        const { id } = await firstValueFrom(api.createChat(name, userId));
        patchState(store, { creating: false, createdChatId: id });
        await store.loadMyChats(userId);
      } catch (err) {
        patchState(store, {
          creating: false,
          error: err instanceof Error ? err.message : String(err),
        });
        throw err;
      }
    },
  })),
) {}