import { inject } from '@angular/core';
import { Router, Routes, UrlTree } from '@angular/router';

import { SessionStore } from './shared/session/session.store';

// Functional guard: allow only when a current user is selected, else send to /select.
const requireUser = (): boolean | UrlTree => {
  const session = inject(SessionStore);
  return session.currentUserId() ? true : inject(Router).parseUrl('/select');
};

export const routes: Routes = [
  {
    path: 'select',
    loadComponent: () => import('./pages/user-select/user-select').then((m) => m.UserSelect),
  },
  {
    path: '',
    canActivate: [requireUser],
    loadComponent: () => import('./pages/chat-page/chat-page').then((m) => m.ChatPage),
    children: [
      {
        path: 'chat/:contactId',
        loadComponent: () => import('./widgets/chat-window/chat-window').then((m) => m.ChatWindow),
      },
    ],
  },
  { path: '**', redirectTo: '' },
];