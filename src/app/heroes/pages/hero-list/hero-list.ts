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
import { ConfirmDialog } from '../../../shared/components/confirm-dialog/confirm-dialog';
import { ConfirmDialogData } from '../../../Core/Models/confirm-dialog.model';
import { MatDialog } from '@angular/material/dialog';
import { LoadingService } from '../../../Core/services/loading.service';

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
  MatPaginatorModule
],
  templateUrl: './hero-list.html',
  styleUrl: './hero-list.css',
})
export class HeroList {
  private readonly heroService = inject(HeroService);
  private readonly dialog = inject(MatDialog);
  private readonly loading = inject(LoadingService);

  readonly searchTerm = signal('');
  readonly pageSize = signal(10);
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
    const data: ConfirmDialogData = {
      title: 'Confirmar borrado',
      message: `¿Seguro que querés borrar a ${name}?`,
    };
    this.dialog
      .open(ConfirmDialog, { data })
      .afterClosed()
      .subscribe(async(confirmed: boolean | undefined) => {
        if (!confirmed) return; 
      this.loading.show();
      await new Promise((r) => setTimeout(r, 800));
      this.heroService.deleteHero(id);
      this.loading.hide();
      });
  }


  universeLogo(universe: 'DC' | 'Marvel'): string {
    return universe === 'DC' ? 'assets/DC.jpeg' : 'assets/Marvel.jpeg';
  }



}
