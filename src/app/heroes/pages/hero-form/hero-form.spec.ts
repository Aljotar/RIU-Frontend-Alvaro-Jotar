import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { of } from 'rxjs';
import { Hero } from '../../../Core/Models/hero.model';
import { HeroService } from '../../../Core/services/hero.service';
import { HeroForm } from './hero-form';

describe('HeroForm', () => {
  let component: HeroForm;
  let fixture: ComponentFixture<HeroForm>;
  let createHero: ReturnType<typeof vi.fn>;
  let updateHero: ReturnType<typeof vi.fn>;
  let getHeroesById: ReturnType<typeof vi.fn>;
  let navegate: ReturnType<typeof vi.fn>;

  const mockHero: Hero = {
    id: 1,
    name: 'Spider-Man',
    power: 'Agilidad',
    universe: 'Marvel',
    image: 'assets/heroes/Spiderman.jpeg',
    antagonist: 'Duende verde',
  };

  beforeEach(async () => {
    createHero = vi.fn(() => of(undefined));
    updateHero = vi.fn(() => of(undefined));
    getHeroesById = vi.fn((id: number) =>
      id === mockHero.id ? mockHero : undefined,
    );

    await TestBed.configureTestingModule({
      imports: [HeroForm],
      providers: [
        provideRouter([]),
        {
          provide: HeroService,
          useValue: {
            createHero,
            updateHero,
            getHeroesById,
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HeroForm);
    component = fixture.componentInstance;
    navegate = vi.spyOn(TestBed.inject(Router), 'navigate');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should be invalid when empty in create mode', () => {
    expect(component.isEditModal).toBe(false);
    expect(component.heroForm().invalid()).toBe(true);
  });

  it('should load hero data in edit mode', () => {
    fixture.componentRef.setInput('id', '1');
    fixture.detectChanges();

    expect(component.isEditModal).toBe(true);
    expect(component.heroModel().name).toBe('Spider-Man');
    expect(component.heroModel().universe).toBe('Marvel');
  });

  it('should navigate away when edit id does not exist', () => {
    fixture.componentRef.setInput('id', '5');
    fixture.detectChanges();

    expect(navegate).toHaveBeenCalledWith(['/heroes']);
  });

  it('should call createHero on submit in create mode', async () => {
    component.heroModel.set({
      name: 'Flash',
      power: 'Super velocidad',
      universe: 'DC',
      image: 'assets/heroes/Flash.jpeg',
      antagonist: 'Reverse Flash',
    });

    await component.onSubmit(new Event('submit'));

    expect(createHero).toHaveBeenCalled();
    expect(updateHero).not.toHaveBeenCalled();
    expect(navegate).toHaveBeenCalledWith(['/heroes']);
  });

  it('should call updateHero on submit in edit mode', async () => {
    fixture.componentRef.setInput('id', '1');
    fixture.detectChanges();

    component.heroModel.set({
      ...component.heroModel(),
      power: 'Sentido aracnido',
    });

    await component.onSubmit(new Event('submit'));

    expect(updateHero).toHaveBeenCalledWith({
      id: 1,
      name: 'Spider-Man',
      power: 'Sentido aracnido',
      universe: 'Marvel',
      image: 'assets/heroes/Spiderman.jpeg',
      antagonist: 'Duende verde',
    });
    expect(createHero).not.toHaveBeenCalled();
    expect(navegate).toHaveBeenCalledWith(['/heroes']);
  });

  it('should not submit when form is invalid', async () => {
    await component.onSubmit(new Event('submit'));

    expect(createHero).not.toHaveBeenCalled();
    expect(updateHero).not.toHaveBeenCalled();
    expect(navegate).not.toHaveBeenCalled();
  });
});
