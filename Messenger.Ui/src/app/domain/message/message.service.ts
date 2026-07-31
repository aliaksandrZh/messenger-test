import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { API_BASE_URL } from '../../core/config/config';
import { Message } from './message.model';

@Injectable({ providedIn: 'root' })
export class MessageService {
  private readonly http = inject(HttpClient);
  private readonly base = API_BASE_URL;

  listMessages(chatId: string): Observable<Message[]> {
    return this.http.get<Message[]>(`${this.base}/api/messages/${chatId}`);
  }
}