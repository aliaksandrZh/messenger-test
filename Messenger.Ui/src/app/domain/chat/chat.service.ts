import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { API_BASE_URL } from '../../core/config/config';
import { Chat } from './chat.model';

@Injectable({ providedIn: 'root' })
export class ChatService {
  private readonly http = inject(HttpClient);
  private readonly base = API_BASE_URL;

  createChat(name: string, creatorUserId: string): Observable<{ id: string }> {
    return this.http.post<{ id: string }>(`${this.base}/api/chats`, { name, creatorUserId });
  }

  getMyChats(userId: string, query = ''): Observable<Chat[]> {
    return this.http.get<Chat[]>(`${this.base}/api/chats/user/${userId}`, { params: { query } });
  }

  invite(chatId: string, userIds: string[]): Observable<unknown> {
    return this.http.post(`${this.base}/api/chats/${chatId}/participants`, { userIds });
  }
}