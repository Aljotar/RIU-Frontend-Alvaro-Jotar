import { ChangeDetectionStrategy, Component, effect, inject, input, linkedSignal } from '@angular/core';
import { form, FormField, minLength, required } from '@angular/forms/signals';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router, RouterLink } from '@angular/router';
import { HeroService } from '../../../Core/services/hero.service';
import { EMPTY_HERO_FORM, HeroFormModel } from '../../../Core/Models/hero.model';
import { UpperCase } from '../../../shared/directives/upper-case';
import { LoadingService } from '../../../Core/services/loading.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-hero-form',
  imports: [
    FormField,
    RouterLink,
    MatToolbarModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    UpperCase
  ],
  templateUrl: './hero-form.html',
  styleUrl: './hero-form.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeroForm {
  private readonly router = inject(Router);
  private readonly heroService = inject(HeroService);
  private readonly loading = inject(LoadingService);

  readonly id = input<string>();

  readonly heroModel = linkedSignal({
    source: this.id,
    computation: (heroId): HeroFormModel => {
      if (!heroId) return EMPTY_HERO_FORM;

      const hero = this.heroService.getHeroesById(Number(heroId));
      if (!hero)  return EMPTY_HERO_FORM;

      return {
        name: hero.name,
        power: hero.power,
        universe: hero.universe,
        image: hero.image,
        antagonist: hero.antagonist
      };
    },
  })

  readonly heroForm = form(this.heroModel, (p) => {
    required(p.name, { message: 'El nombre del heroe es obligatorio' });
    minLength(p.name, 2, { message: 'El nombre debe tener al menos 2 caracteres' });

    required(p.power, { message: 'El poder del heroe es obligatorio' });
    required(p.universe, { message: 'Debes elegir un universo' });
    required(p.image, { message: 'La url de imagen es obligatoria' });
    required(p.antagonist, { message: 'El Antagonista del heroe es obligatorio' });
  });

  get isEditModal(): boolean {
    return !!this.id();
  }

  constructor() {
    effect(() => {
      const heroId = this.id();
      if (!heroId) return;
      if (!this.heroService.getHeroesById(Number(heroId))) {
        this.router.navigate(['/heroes'])
      }
    })
  }

  async onSubmit(event: Event): Promise<void> {
    event.preventDefault();
    if (this.heroForm().invalid()) return;


    const data = this.heroModel();

    if (this.isEditModal) {
      await firstValueFrom(
        this.heroService.upDateHero({ id: Number(this.id()), ...data }),
      );
    } else {
      await firstValueFrom(this.heroService.createHero(data));
    }

    this.router.navigate(['/heroes']);
  }


}
