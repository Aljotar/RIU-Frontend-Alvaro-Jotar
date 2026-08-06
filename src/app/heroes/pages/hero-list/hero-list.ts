import { Component, computed, inject, signal } from '@angular/core';
import { HeroService } from '../../../Core/services/hero.service';
import { RouterLink } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-hero-list',
  imports: [
  RouterLink,
  MatToolbarModule,
  MatButtonModule,
  MatIconModule,
  MatFormFieldModule,
  MatInputModule,
  MatCardModule,
  MatPaginatorModule,
],
  templateUrl: './hero-list.html',
  styleUrl: './hero-list.css',
})
export class HeroList {
  private readonly heroService = inject(HeroService);


  readonly searchTerm = signal('');
  readonly pageSize = signal(5);
  readonly currentPage = signal(1);

  readonly filteredHeroes = computed(() => {
    const term = this.searchTerm().trim().toLowerCase();
    const heroes = this.heroService.heroes();

    if(!term) return heroes;

    return heroes.filter((hero) =>
      hero.name.toLowerCase().includes(term),
    );
  });

  readonly totalPages = computed(() => 
    Math.max(1, Math.ceil(this.filteredHeroes().length / this.pageSize())),
  );

  readonly paginatedHeroes = computed(() => {
    const page = this.currentPage();
    const size = this.pageSize();
    const start = (page - 1) * size;
    return this.filteredHeroes().slice(start, start + size);
  })

  onSearch(value: string): void {
    this.searchTerm.set(value);
    this.currentPage.set(1);
  }

  onPage(event: PageEvent): void {
    this.pageSize.set(event.pageSize);
    this.currentPage.set(event.pageIndex + 1);
  }

  onDelete(id: number, name: string): void {
    const confirmed =  confirm(`¿Seguro que queres borrar al heroe ${name}`);
    if(!confirmed) return;
    this.heroService.deleteHero(id);
  }

  universeLogo(universe: 'DC' | 'Marvel'): string {
    return universe === 'DC' ? 'assets/DC.jpeg' : 'assets/Marvel.jpeg';
  }
}
