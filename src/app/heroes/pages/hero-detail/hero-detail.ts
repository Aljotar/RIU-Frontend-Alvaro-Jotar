import { ChangeDetectionStrategy, Component, computed, effect, inject, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterLink } from '@angular/router';
import { HeroService } from '../../../Core/services/hero.service';
import { HeroUniverse } from '../../../Core/Models/hero.model';
import { NgOptimizedImage } from '@angular/common';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-hero-detail',
  imports: [
    RouterLink,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    NgOptimizedImage
  ],
  templateUrl: './hero-detail.html',
  styleUrl: './hero-detail.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeroDetail {
  private readonly _heroService = inject(HeroService);

  readonly id = input.required<string>();

  readonly hero = computed(() =>
    this._heroService.getHeroesById(Number(this.id())),
  );

  constructor() {
    const title = inject(Title);

    effect(() => {
      const hero = this.hero();
      title.setTitle(
        hero ? `${hero.name} | Super heroes` : 'Heroe no encontrado | Super heroes',
      )
    })
  }

  universeLogo(universe: HeroUniverse): string {
    return universe === 'DC' ? 'assets/DC.jpeg' : 'assets/Marvel.jpeg';
  }

}
