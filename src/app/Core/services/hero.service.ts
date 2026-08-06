import { Injectable, signal } from '@angular/core';
import { Hero } from '../Models/hero.model';
import { SEED_HEROES } from '../Data/seed-heroes';
import { readonly } from '@angular/forms/signals';

@Injectable({ 
    providedIn: 'root' 
})
export class HeroService {
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




}


