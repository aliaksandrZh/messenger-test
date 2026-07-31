import { Routes } from '@angular/router';

export const UserSelectRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./user-select.component').then((m) => m.UserSelectComponent),
  },
];