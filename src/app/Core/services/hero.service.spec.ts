import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';
import { SEED_HEROES } from '../Data/seed-heroes';
import { mockHeroesApiInterceptor } from '../interceptors/mock-heroes-api.interceptor';
import { Hero } from '../Models/hero.model';
import { HeroService } from './hero.service';

describe('HeroService', () => {
  let service: HeroService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        HeroService,
        provideHttpClient(withInterceptors([mockHeroesApiInterceptor])),
      ],
    });
    service = TestBed.inject(HeroService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return all heroes from seed', () => {
    const heroes = service.getAllHeroes();
    expect(heroes.length).toBe(SEED_HEROES.length);
    expect(heroes[0].name).toBe(SEED_HEROES[0].name);
  });

  it('should get a hero by id', () => {
    const hero = service.getHeroesById(1);
    expect(hero).toBeDefined();
    expect(hero?.name).toBe('Spider-Man');
  });

  it('should return undifined when id does not exist', () => {
    expect(service.getHeroesById(100)).toBeUndefined();
  });

  it('should search heroes by name containing term', () => {
    const result = service.searchHeroesByName('man');
    const names = result.map((h) => h.name);

    expect(names).toContain('Spider-Man');
    expect(names).toContain('Superman');
    expect(names).toContain('Iron Man');
    expect(names).toContain('Batman');
  });

  it('should return all heroes when search term is empty', () => {
    expect(service.searchHeroesByName('').length).toBe(SEED_HEROES.length);
  });

  it('should create a new hero with generated id', async () => {
    const created = await firstValueFrom(
      service.createHero({
        name: 'Aquaman',
        power: 'Fuerza, durabilidad y agilidad sobrehumanas adaptadas para la vida en las profundidades del océano',
        universe: 'DC',
        image: 'assets/heroes/aquaman.jpeg',
        antagonist: 'Manta Negra',
      }),
    );

    expect(created.id).toBe(SEED_HEROES.length + 1);
    expect(service.getAllHeroes().length).toBe(SEED_HEROES.length + 1);
    expect(service.getHeroesById(created.id)?.name).toBe('Aquaman');
  });

  it('should update an existing hero', async () => {
    const original = service.getHeroesById(1);
    const update: Hero = { ...original!, power: 'Nuevo poder' };

    await firstValueFrom(service.updateHero(update));

    expect(service.getHeroesById(1)?.power).toBe('Nuevo poder');
  });

  it('should delete a hero by id', async () => {
    await firstValueFrom(service.deleteHero(1));

    expect(service.getHeroesById(1)).toBeUndefined();
    expect(service.getAllHeroes().length).toBe(SEED_HEROES.length - 1);
  });
});
