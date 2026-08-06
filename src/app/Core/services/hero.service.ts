import { Injectable, signal } from '@angular/core';
import { Hero } from '../Models/hero.model';
import { SEED_HEROES } from '../Data/seed-heroes';

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


    createHero(heroData: Omit<Hero, 'id'>): Hero {
        const newHero: Hero = { ...heroData, id: this.generateId()};
        this.heroesSignal.update((heroes) => [...heroes, newHero]);
        return newHero;
    }

    upDateHero(upDateHero: Hero): void {
        this.heroesSignal.update((heroes) => 
            heroes.map((hero) =>
                hero.id === upDateHero.id ? upDateHero : hero,
            ),
        );
    }

    deleteHero(id: number): void {
        this.heroesSignal.update((heros) =>
            heros.filter((hero) => hero.id !== id),
        );
    }


    private generateId(): number {
        const heroes = this.heroesSignal();
        return heroes.length ? Math.max(...heroes.map((h) => h.id)) + 1 : 1;
    }



}


