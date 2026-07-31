import { Routes } from '@angular/router';

export const ChatRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./chat-page.component').then((m) => m.ChatPage),
    children: [
      {
        path: 'chat/:chatId',
        loadComponent: () =>
          import('./components/chat-window/chat-window.component').then((m) => m.ChatWindow),
      },
    ],
  },
];