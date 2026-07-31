import { Service, computed, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { signalStore, withState, withComputed, withMethods, patchState } from '@ngrx/signals';
import { withEntities, setAllEntities } from '@ngrx/signals/entities';

import { ChatService } from './chat.service';
import { SessionStore } from '../../core/session/session.store';
import { Chat } from './chat.model';

interface ChatState {
  creating: boolean;
  error: string | null;
  createdChatId: string | null;
  selectedChatId: string | null;
}

const initialState: ChatState = {
  creating: false,
  error: null,
  createdChatId: null,
  selectedChatId: null,
};

const errorMessage = (err: unknown): string => (err instanceof Error ? err.message : String(err));

@Service()
export class ChatStore extends signalStore(
  withState<ChatState>(initialState),
  withEntities<Chat>(),
  withComputed(({ entities, selectedChatId }) => ({
    chats: computed(() => entities()),
    selectedChat: computed(() => entities().find((c) => c.id === selectedChatId()) ?? null),
  })),
  withMethods((store, api = inject(ChatService)) => ({
    async loadMyChats(userId: string): Promise<void> {
      try {
        const chats = await firstValueFrom(api.getMyChats(userId));
        patchState(store, setAllEntities(chats), { error: null });
      } catch (err) {
        patchState(store, { error: errorMessage(err) });
        throw err;
      }
    },
    selectChat(id: string): void {
      patchState(store, { selectedChatId: id });
    },
    async invite(chatId: string, userIds: string[]): Promise<void> {
      try {
        await firstValueFrom(api.invite(chatId, userIds));
      } catch (err) {
        patchState(store, { error: errorMessage(err) });
        throw err;
      }
    },
  })),
  withMethods((store, api = inject(ChatService), session = inject(SessionStore)) => ({
    async createChat(name: string): Promise<void> {
      const userId = session.currentUserId();
      if (!userId) throw new Error('No current user selected.');
      patchState(store, { creating: true, error: null });
      try {
        const { id } = await firstValueFrom(api.createChat(name, userId));
        patchState(store, { creating: false, createdChatId: id });
        await store.loadMyChats(userId);
      } catch (err) {
        patchState(store, { creating: false, error: errorMessage(err) });
        throw err;
      }
    },
  })),
) {}