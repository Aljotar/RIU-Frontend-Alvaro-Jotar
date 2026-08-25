import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'heroes' },
  {
    path: 'heroes',
    loadComponent: () =>
      import('./heroes/pages/hero-list/hero-list').then((m) => m.HeroList),
  },
  {
    path: 'heroes/new',
    loadComponent: () =>
      import('./heroes/pages/hero-form/hero-form').then((m) => m.HeroForm),
  },
  {
    path: 'heroes/:id/edit',
    loadComponent: () =>
      import('./heroes/pages/hero-form/hero-form').then((m) => m.HeroForm),
  },
  {
    path: 'heroes/:id',
    loadComponent: () =>
      import('./heroes/pages/hero-detail/hero-detail').then((m) => m.HeroDetail),
  },
  { path: '**', redirectTo: 'heroes' }
];
