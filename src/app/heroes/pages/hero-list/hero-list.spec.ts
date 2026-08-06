import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { HeroList } from './hero-list';
import { Hero } from '../../../Core/Models/hero.model';
import { signal } from '@angular/core';
import { HeroService } from '../../../Core/services/hero.service';

describe('HeroList', () => {
  let component: HeroList;
  let fixture: ComponentFixture<HeroList>;
  let heroesSignal: ReturnType<typeof signal<Hero[]>>;
  let deleteHero: ReturnType<typeof vi.fn>;

  const mockHeroes: Hero[] = [
    {
      id: 1,
      name: 'Spider-Man',
      power: 'Agilidad',
      universe: 'Marvel',
      image: 'assets/heroes/Spiderman.jpeg',
      antagonist: 'Green Goblin',
    },
    {
      id: 2,
      name: 'Batman',
      power: 'Intelecto',
      universe: 'DC',
      image: 'assets/heroes/Batman.jpeg',
      antagonist: 'Joker',
    },
    {
      id: 3,
      name: 'Iron Man',
      power: 'Armadura',
      universe: 'Marvel',
      image: 'assets/heroes/Ironman.jpeg',
      antagonist: 'Mandarin',
    },
  ];

  beforeEach(async () => {

    heroesSignal = signal<Hero[]>([...mockHeroes]);
    deleteHero = vi.fn((id: number) => {
      heroesSignal.update((heroes) => heroes.filter((h) => h.id !== id));
    })

    await TestBed.configureTestingModule({
      imports: [HeroList],
      providers: [
        provideRouter([]), //
        {
          provide: HeroService,
          useValue: {
            heroes: heroesSignal.asReadonly(),
            deleteHero: deleteHero,
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HeroList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should create', () => {
    expect(component.paginatedHeroes().length).toBe(3);
    expect(component.filteredHeroes().map((h) => h.name)).toContain('Spider-Man');
  });

  it('should show heroes from the service', () => {
    expect(component.paginatedHeroes().length).toBe(3);
    expect(component.paginatedHeroes().map((h) => h.name)).toContain('Spider-Man');
  });

  it('should filter heroes by name', () => {
    component.onSearch('iron');
    expect(component.paginatedHeroes().map((h) => h.name)).toEqual(['Iron Man']);
  });


  it('should call deleteHero when user confirms', () => {
    vi.spyOn(window, 'confirm').mockReturnValue(true);
    component.onDelete(1, 'Spider-Man');
    expect(deleteHero).toHaveBeenCalledWith(1);
  });

  it('should not call deleteHero when user cancels', () => {
    vi.spyOn(window, 'confirm').mockReturnValue(false);
    component.onDelete(1, 'Spider-Man');
    expect(deleteHero).not.toHaveBeenCalled();
  });

});
