import { Service, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { API_BASE_URL } from '../config/config';
import { Chat } from '../../entities/chat/chat.model';

@Service()
export class ChatsApiService {
  private readonly http = inject(HttpClient);
  private readonly base = API_BASE_URL;

  createChat(name: string): Observable<{ id: string }> {
    return this.http.post<{ id: string }>(`${this.base}/api/chats`, { name });
  }

  searchChats(query = ''): Observable<Chat[]> {
    return this.http.get<Chat[]>(`${this.base}/api/chats`, { params: { query } });
  }

  invite(chatId: string, userIds: string[]): Observable<unknown> {
    return this.http.post(`${this.base}/api/chats/${chatId}/participants`, { userIds });
  }

  join(chatId: string, userId: string): Observable<unknown> {
    return this.http.post(`${this.base}/api/chats/${chatId}/join`, { userId });
  }
}