import { Routes } from '@angular/router';
import { HeroList } from './heroes/pages/hero-list/hero-list';
import { HeroForm } from './heroes/pages/hero-form/hero-form';
import { HeroDetail } from './heroes/pages/hero-detail/hero-detail';

export const routes: Routes = [
    { path: '', pathMatch: 'full', redirectTo: 'heroes' },
    { path: 'heroes', component: HeroList },
    { path: 'heroes/new', component: HeroForm },
    { path: 'heroes/:id', component: HeroDetail },
    { path: 'heroes/:id/edit', component: HeroForm }
];
