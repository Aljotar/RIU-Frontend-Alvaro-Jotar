import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HeroDetail } from './hero-detail'
import { provideRouter } from '@angular/router';
import { HeroService } from '../../../Core/services/hero.service';
import { Hero } from '../../../Core/Models/hero.model';


describe('HeroDetail', () => {
    let component: HeroDetail;
    let fixture: ComponentFixture<HeroDetail>;
    let getHeroesById: ReturnType<typeof vi.fn>;

    const mockHero: Hero = {
        id: 1,
        name: 'Spider-Man',
        power: 'Agilidad',
        universe: 'Marvel',
        image: 'assets/heroes/Spiderman.jpeg',
        antagonist: 'Duende Verde'
    };

    beforeEach(async () => {
        getHeroesById = vi.fn((id: number) =>
            id === mockHero.id ? mockHero : undefined,
        );

        await TestBed.configureTestingModule({
            imports: [HeroDetail],
            providers: [
                provideRouter([]),
                {
                    provide: HeroService,
                    useValue: { getHeroesById },
                }
        ]
    
    }).compileComponents();

        fixture = TestBed.createComponent(HeroDetail);
        component = fixture.componentInstance;
    });

    it('should create', () => {
        fixture.componentRef.setInput('id', '1');
        fixture.detectChanges();
        expect(component).toBeTruthy();
    });


    it('should resolve hero from id input', () => {
        fixture.componentRef.setInput('id', '1');
        fixture.detectChanges();

        expect(getHeroesById).toHaveBeenCalledWith(1);
        expect(component.hero()?.name).toBe('Spider-Man');
    });


    it('should return undefined when heros does nor exist', () => {
        fixture.componentRef.setInput('id', '99');
        fixture.detectChanges();

        expect(component.hero()).toBeUndefined();
    });

})