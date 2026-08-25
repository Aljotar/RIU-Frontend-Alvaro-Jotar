import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'heroes' },
  {
    path: 'heroes',
    title: 'Listado | Super heroes',
    loadComponent: () =>
      import('./heroes/pages/hero-list/hero-list').then((m) => m.HeroList),
  },
  {
    path: 'heroes/new',
    title: 'Nuevo heroe | Super heroes',
    loadComponent: () =>
      import('./heroes/pages/hero-form/hero-form').then((m) => m.HeroForm),
  },
  {
    path: 'heroes/:id/edit',
    title: 'Editar heroe | Super heroes',
    loadComponent: () =>
      import('./heroes/pages/hero-form/hero-form').then((m) => m.HeroForm),
  },
  {
    path: 'heroes/:id',
    title: 'detalle | Super heroes',
    loadComponent: () =>
      import('./heroes/pages/hero-detail/hero-detail').then((m) => m.HeroDetail),
  },
  { path: '**', redirectTo: 'heroes' }
];
