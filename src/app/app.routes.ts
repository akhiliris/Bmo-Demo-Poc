import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'intents',
    pathMatch: 'full',
  },
  {
    path: 'intents',
    loadComponent: () =>
      import('./features/intents/intents.component').then(m => m.IntentsComponent),
  },
  {
    path: '**',
    redirectTo: 'intents',
  },
];
