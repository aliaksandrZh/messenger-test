import { Service, computed, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { signalStore, withState, withComputed, withMethods, patchState } from '@ngrx/signals';
import { withEntities, setAllEntities, addEntity, removeAllEntities } from '@ngrx/signals/entities';

import { MessagesApiService } from '../../../shared/api/messages-api.service';
import { Message } from '../message.model';

interface MessagesState {
  loading: boolean;
  activeChatId: string | null;
}

@Service()
export class MessagesStore extends signalStore(
  withState<MessagesState>({ loading: false, activeChatId: null }),
  withEntities<Message>(),
  withComputed(({ entities }) => ({
    messages: computed(() => entities()),
  })),
  withMethods((store, api = inject(MessagesApiService)) => ({
    async loadMessages(chatId: string) {
      patchState(store, { loading: true, activeChatId: chatId });
      try {
        const messages = await firstValueFrom(api.listMessages(chatId));
        patchState(store, setAllEntities(messages), { loading: false });
      } catch (err) {
        patchState(store, { loading: false });
        throw err;
      }
    },
    addMessage(message: Message): void {
      patchState(store, addEntity(message));
    },
    clearMessages(): void {
      patchState(store, removeAllEntities(), { activeChatId: null });
    },
  })),
) {}