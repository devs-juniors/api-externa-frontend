import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CarteiraService } from '../../../core/services/carteira.service';
import { Carteira } from '../../../core/models/carteira.model';

@Component({
  selector: 'app-carteira-list',
  imports: [RouterLink],
  templateUrl: './carteira-list.html',
  styleUrl: './carteira-list.css',
})
export class CarteiraListComponent implements OnInit {
  private readonly carteiraService = inject(CarteiraService);
  private readonly router = inject(Router);

  carteiras = signal<Carteira[]>([]);
  carregando = signal(true);
  searchQuery = signal('');
  currentPage = signal(1);
  readonly pageSize = 10;

  filtradas = computed(() => {
    const q = this.searchQuery().toLowerCase().trim();
    return q
      ? this.carteiras().filter((c) => c.nome.toLowerCase().includes(q))
      : this.carteiras();
  });

  paginadas = computed(() => {
    const start = (this.currentPage() - 1) * this.pageSize;
    return this.filtradas().slice(start, start + this.pageSize);
  });

  totalPages = computed(() => Math.ceil(this.filtradas().length / this.pageSize));

  pages = computed(() => Array.from({ length: this.totalPages() }, (_, i) => i + 1));

  ngOnInit(): void {
    this.carteiraService.listar().subscribe({
      next: (data) => {
        this.carteiras.set(data);
        this.carregando.set(false);
      },
      error: () => this.carregando.set(false),
    });
  }

  onSearch(event: Event): void {
    this.searchQuery.set((event.target as HTMLInputElement).value);
    this.currentPage.set(1);
  }

  irPara(id: number): void {
    this.router.navigate(['/carteiras', id]);
  }

  indiceGlobal(indicePagina: number): number {
    return (this.currentPage() - 1) * this.pageSize + indicePagina + 1;
  }

  formatarData(data: string): string {
    return new Date(data).toLocaleDateString('pt-BR');
  }
}
