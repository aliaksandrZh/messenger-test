import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/chat-page/chat-page').then((m) => m.ChatPage),
    children: [
      {
        path: 'chat/:contactId',
        loadComponent: () => import('./widgets/chat-window/chat-window').then((m) => m.ChatWindow),
      },
    ],
  },
];