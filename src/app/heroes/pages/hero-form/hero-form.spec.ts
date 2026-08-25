import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HeroForm } from './hero-form';
import { Hero } from '../../../Core/Models/hero.model';
import { provideRouter, Router } from '@angular/router';
import { HeroService } from '../../../Core/services/hero.service';
import { LoadingService } from '../../../Core/services/loading.service';
import { signal } from '@angular/core';

describe('HeroForm', () => {
    let component: HeroForm;
    let fixture: ComponentFixture<HeroForm>;
    let createHero: ReturnType<typeof vi.fn>;
    let upDateHero: ReturnType<typeof vi.fn>;
    let getHeroesById: ReturnType<typeof vi.fn>;
    let navegate: ReturnType<typeof vi.fn>;
    let loadingShow: ReturnType<typeof vi.fn>;
    let loadingHide: ReturnType<typeof vi.fn>;

  const mockHero: Hero = {
    id: 1,
    name: 'Spider-Man',
    power: 'Agilidad',
    universe: 'Marvel',
    image: 'assets/heroes/Spiderman.jpeg',
    antagonist: 'Duende verde',
  };

beforeEach(async () => {
  createHero = vi.fn();
  upDateHero = vi.fn();
  getHeroesById = vi.fn((id: number) =>
    id === mockHero.id ? mockHero : undefined,
  );
  loadingShow = vi.fn();
  loadingHide = vi.fn();
  await TestBed.configureTestingModule({
    imports: [HeroForm],
    providers: [
      provideRouter([]),
      {
        provide: HeroService,
        useValue: {
          createHero,
          upDateHero,
          getHeroesById,
        },
      },
      {
        provide: LoadingService,
        useValue: {
          show: loadingShow,
          hide: loadingHide,
          loading: signal(false).asReadonly(),
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

  it('should be invalid when empt create mode', () =>{
    expect(component.isEditModal).toBe(false);
    expect(component.heroForm().invalid()).toBe(true);
  })

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
    vi.useFakeTimers();
    component.heroModel.set({
      name: 'Flash',
      power: 'Super velocidad',
      universe: 'DC',
      image: 'assets/heroes/Flash.jpeg',
      antagonist: 'Reverse Flash',
    });
    const done = component.onSubmit(new Event('submit'));
    await vi.advanceTimersByTimeAsync(800);
    await done;

    expect(createHero).toHaveBeenCalled();
    expect(upDateHero).not.toHaveBeenCalled();
    expect(loadingShow).toHaveBeenCalled();
    expect(loadingHide).toHaveBeenCalled();
    expect(navegate).toHaveBeenCalledWith(['/heroes']);
    vi.useRealTimers();
  });

  it('should call upDateHero on submit in edit mode', async () => {
    vi.useFakeTimers();

    fixture.componentRef.setInput('id', '1');
    fixture.detectChanges();

    component.heroModel.set({
      ...component.heroModel(),
      power: 'Sentido aracnido',
    });

    const done = component.onSubmit(new Event('submit'));
    await vi.advanceTimersByTimeAsync(800);
    await done;

    expect(upDateHero).toHaveBeenCalledWith({
      id: 1,
      name: 'Spider-Man',
      power: 'Sentido aracnido',
      universe: 'Marvel',
      image: 'assets/heroes/Spiderman.jpeg',
      antagonist: 'Duende verde',
    });
    expect(createHero).not.toHaveBeenCalled();
    expect(navegate).toHaveBeenCalledWith(['/heroes']);
    vi.useRealTimers();
  });

  it('should not submit when form is invalid', async () => {
    await component.onSubmit(new Event('submit'));
    expect(createHero).not.toHaveBeenCalled();
    expect(upDateHero).not.toHaveBeenCalled();
    expect(navegate).not.toHaveBeenCalled();
  });

})