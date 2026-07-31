import { Service, computed, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { signalStore, withState, withComputed, withMethods, patchState } from '@ngrx/signals';
import { withEntities, setAllEntities, addEntity, removeAllEntities } from '@ngrx/signals/entities';

import { MessageService } from './message.service';
import { Message } from './message.model';

interface MessageState {
  loading: boolean;
  activeChatId: string | null;
}

@Service()
export class MessageStore extends signalStore(
  withState<MessageState>({ loading: false, activeChatId: null }),
  withEntities<Message>(),
  withComputed(({ entities }) => ({
    messages: computed(() => entities()),
  })),
  withMethods((store, api = inject(MessageService)) => ({
    async loadMessages(chatId: string): Promise<void> {
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