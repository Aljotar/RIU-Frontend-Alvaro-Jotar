import { ChangeDetectionStrategy, Component, inject, input, OnInit, signal } from '@angular/core';
import { form, FormField, minLength, required } from '@angular/forms/signals';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router, RouterLink } from '@angular/router';
import { HeroService } from '../../../Core/services/hero.service';
import { HeroFormModel } from '../../../Core/Models/hero.model';
import { UpperCase } from '../../../shared/directives/upper-case';
import { LoadingService } from '../../../Core/services/loading.service';

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
export class HeroForm implements OnInit {
  private readonly router = inject(Router);
  private readonly heroService = inject(HeroService);
  private readonly loading = inject(LoadingService);

  readonly id = input<string>();

  readonly heroModel = signal<HeroFormModel>({
    name: '',
    power: '',
    universe: 'Marvel',
    image: '',
    antagonist: ''
  });

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

  ngOnInit(): void {
    const heroId = this.id();
    if (!heroId) return;

    const hero = this.heroService.getHeroesById(Number(heroId));
    if (!hero) {
      this.router.navigate(['/heroes']);
      return
    }

    this.heroModel.set({
      name: hero.name,
      power: hero.power,
      universe: hero.universe,
      image: hero.image,
      antagonist: hero.antagonist
    });

  }

  async onSubmit(event: Event): Promise<void> {
    event.preventDefault();
    if (this.heroForm().invalid()) return;
    this.loading.show();
    await new Promise((r) => setTimeout(r, 800));
    const data = this.heroModel();
    if (this.isEditModal) {
      this.heroService.upDateHero({ id: Number(this.id()), ...data });
    } else {
      this.heroService.createHero(data);
    }
    this.loading.hide();
    this.router.navigate(['/heroes']);
  }


}
