import { Service, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { API_BASE_URL } from '../config/config';
import { Message } from '../../entities/message/message.model';

@Service()
export class MessagesApiService {
  private readonly http = inject(HttpClient);
  private readonly base = API_BASE_URL;

  listMessages(chatId: string): Observable<Message[]> {
    return this.http.get<Message[]>(`${this.base}/api/messages/${chatId}`);
  }
}