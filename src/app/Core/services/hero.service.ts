import { inject, Injectable, signal } from '@angular/core';
import { Hero } from '../Models/hero.model';
import { SEED_HEROES } from '../Data/seed-heroes';
import { HttpClient } from '@angular/common/http';
import { Observable, map, tap } from 'rxjs';

@Injectable({ 
    providedIn: 'root' 
})
export class HeroService {
    private readonly _http = inject(HttpClient)
    private readonly _heroesSignal = signal<Hero[]>([...SEED_HEROES]);

    readonly heroes = this._heroesSignal.asReadonly();

    getAllHeroes(): Hero[] {
        return this._heroesSignal();
    }

    getHeroesById(id: number): Hero | undefined {
        return this._heroesSignal().find((hero) => hero.id === id);
    }

    searchHeroesByName(term: string): Hero[] {
        const normalized = term.trim().toLocaleLowerCase();
        if(!normalized) return this.getAllHeroes();
        return this._heroesSignal().filter((hero) => 
            hero.name.toLocaleLowerCase().includes(normalized),
        )
    }


    createHero(heroData: Omit<Hero, 'id'>): Observable<Hero> {
        const newHero: Hero = { ...heroData, id: this._generateId() };
        return this._http.post<Hero>('/api/heroes', newHero).pipe(
        tap(() => {
            this._heroesSignal.update((heroes) => [...heroes, newHero]);
        }),
        map(() => newHero),
        );
    }

    updateHero(updatedHero: Hero): Observable<void> {
        return this._http.put<void>(`/api/heroes/${updatedHero.id}`, updatedHero).pipe(
        tap(() => {
            this._heroesSignal.update((heroes) =>
            heroes.map((hero) =>
                hero.id === updatedHero.id ? updatedHero : hero,
            ),
            );
        }),
        );
    }

    deleteHero(id: number): Observable<void> {
    return this._http.delete<void>(`/api/heroes/${id}`).pipe(
        tap(() => {
        this._heroesSignal.update((heroes) =>
            heroes.filter((hero) => hero.id !== id),
        );
        }),
    );
    }


    private _generateId(): number {
        const heroes = this._heroesSignal();
        return heroes.length ? Math.max(...heroes.map((h) => h.id)) + 1 : 1;
    }



}


