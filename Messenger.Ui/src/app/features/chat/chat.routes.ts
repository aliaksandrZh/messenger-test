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
      {
        path: 'new',
        loadComponent: () =>
          import('./components/new-chat-view/new-chat-view.component').then(
            (m) => m.NewChatViewComponent,
          ),
      },
      {
        path: '',
        loadComponent: () =>
          import('./components/empty-state/empty-state.component').then((m) => m.EmptyStateComponent),
      },
    ],
  },
];