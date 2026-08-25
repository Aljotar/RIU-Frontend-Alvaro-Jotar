import { inject, Injectable, signal } from '@angular/core';
import { Hero } from '../Models/hero.model';
import { SEED_HEROES } from '../Data/seed-heroes';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

@Injectable({ 
    providedIn: 'root' 
})
export class HeroService {
    private readonly  http = inject(HttpClient)
    private readonly heroesSignal = signal<Hero[]>([...SEED_HEROES]);

    readonly heroes = this.heroesSignal.asReadonly();

    getAllHeroes(): Hero[] {
        return this.heroesSignal();
    }

    getHeroesById(id: number): Hero | undefined {
        return this.heroesSignal().find((hero) => hero.id === id);
    }

    searchHeroesByName(term: string): Hero[] {
        const normalized = term.trim().toLocaleLowerCase();
        if(!normalized) return this.getAllHeroes();
        return this.heroesSignal().filter((hero) => 
            hero.name.toLocaleLowerCase().includes(normalized),
        )
    }


    createHero(heroData: Omit<Hero, 'id'>): Observable<Hero> {
        const newHero: Hero = { ...heroData, id: this.generateId() };
        return this.http.post<Hero>('/api/heroes', newHero).pipe(
        tap(() => {
            this.heroesSignal.update((heroes) => [...heroes, newHero]);
        }),
        );
    }

    upDateHero(updatedHero: Hero): Observable<void> {
        return this.http.put<void>(`/api/heroes/${updatedHero.id}`, updatedHero).pipe(
        tap(() => {
            this.heroesSignal.update((heroes) =>
            heroes.map((hero) =>
                hero.id === updatedHero.id ? updatedHero : hero,
            ),
            );
        }),
        );
    }

    deleteHero(id: number): Observable<void> {
    return this.http.delete<void>(`/api/heroes/${id}`).pipe(
        tap(() => {
        this.heroesSignal.update((heroes) =>
            heroes.filter((hero) => hero.id !== id),
        );
        }),
    );
    }


    private generateId(): number {
        const heroes = this.heroesSignal();
        return heroes.length ? Math.max(...heroes.map((h) => h.id)) + 1 : 1;
    }



}


