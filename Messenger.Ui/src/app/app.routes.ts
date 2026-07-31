import { inject } from '@angular/core';
import { Router, Routes, UrlTree } from '@angular/router';

import { SessionStore } from './core/session/session.store';

// Functional guard: allow only when a current user is selected, else send to /select.
const requireUser = (): boolean | UrlTree => {
  const session = inject(SessionStore);
  return session.currentUserId() ? true : inject(Router).parseUrl('/select');
};

export const routes: Routes = [
  {
    path: 'select',
    loadChildren: () =>
      import('./features/user-select/user-select.routes').then((m) => m.UserSelectRoutes),
  },
  {
    path: '',
    canActivate: [requireUser],
    loadChildren: () => import('./features/chat/chat.routes').then((m) => m.ChatRoutes),
  },
  { path: '**', redirectTo: '' },
];