import { Service, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { API_BASE_URL } from '../config/config';
import { Contact } from '../../entities/contact/contact.model';

@Service()
export class UsersApiService {
  private readonly http = inject(HttpClient);
  private readonly base = API_BASE_URL;

  searchUsers(query = ''): Observable<Contact[]> {
    return this.http.get<Contact[]>(`${this.base}/api/users`, { params: { query } });
  }

  getContacts(userId: string): Observable<Contact[]> {
    return this.http.get<Contact[]>(`${this.base}/api/users/${userId}/contacts`);
  }

  createUser(name: string, email: string): Observable<Contact> {
    return this.http.post<Contact>(`${this.base}/api/users`, { name, email });
  }

  addContact(userId: string, contactId: string): Observable<unknown> {
    return this.http.post(`${this.base}/api/users/${userId}/contacts`, { contactId });
  }
}