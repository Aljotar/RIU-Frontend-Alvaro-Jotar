import { Component, computed, inject, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterLink } from '@angular/router';
import { HeroService } from '../../../Core/services/hero.service';
import { HeroUniverse } from '../../../Core/Models/hero.model';

@Component({
  selector: 'app-hero-detail',
  imports: [
    RouterLink,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
  ],
  templateUrl: './hero-detail.html',
  styleUrl: './hero-detail.css',
})
export class HeroDetail {
  private readonly heroService = inject(HeroService);

  readonly id = input.required<string>();

  readonly hero = computed(() =>
    this.heroService.getHeroesById(Number(this.id())),
  );

  universeLogo(universe: HeroUniverse): string {
    return universe === 'DC' ? 'assets/DC.jpeg' : 'assets/Marvel.jpeg';
  }

}
