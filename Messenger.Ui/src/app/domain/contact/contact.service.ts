import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { API_BASE_URL } from '../../core/config/config';
import { Contact } from './contact.model';

@Injectable({ providedIn: 'root' })
export class ContactService {
  private readonly http = inject(HttpClient);
  private readonly base = API_BASE_URL;

  searchUsers(query = ''): Observable<Contact[]> {
    return this.http.get<Contact[]>(`${this.base}/api/users`, { params: { query } });
  }
}