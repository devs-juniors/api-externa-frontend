import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CorretoraService } from '../../../core/services/corretora.service';
import { Corretora } from '../../../core/models/corretora.model';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner';

@Component({
  selector: 'app-corretora-list',
  imports: [RouterLink, LoadingSpinnerComponent],
  templateUrl: './corretora-list.html',
  styleUrl: './corretora-list.css',
})
export class CorretoraListComponent implements OnInit {
  private readonly corretoraService = inject(CorretoraService);
  private readonly router = inject(Router);

  corretoras = signal<Corretora[]>([]);
  carregando = signal(true);
  searchQuery = signal('');
  currentPage = signal(1);
  readonly pageSize = 10;

  filtradas = computed(() => {
    const q = this.searchQuery().toLowerCase().trim();
    return q
      ? this.corretoras().filter(
          (c) => c.cnpj.includes(q) || c.razaoSocial.toLowerCase().includes(q),
        )
      : this.corretoras();
  });

  paginadas = computed(() => {
    const start = (this.currentPage() - 1) * this.pageSize;
    return this.filtradas().slice(start, start + this.pageSize);
  });

  totalPages = computed(() => Math.ceil(this.filtradas().length / this.pageSize));
  pages = computed(() => Array.from({ length: this.totalPages() }, (_, i) => i + 1));

  ngOnInit(): void {
    this.corretoraService.listar().subscribe({
      next: (data) => {
        this.corretoras.set(data);
        this.carregando.set(false);
      },
      error: () => this.carregando.set(false),
    });
  }

  onSearch(event: Event): void {
    this.searchQuery.set((event.target as HTMLInputElement).value);
    this.currentPage.set(1);
  }

  formatarCnpj(cnpj: string): string {
    const d = cnpj.replace(/\D/g, '');
    if (d.length !== 14) return cnpj;
    return `${d.slice(0, 2)}.${d.slice(2, 5)}.${d.slice(5, 8)}/${d.slice(8, 12)}-${d.slice(12)}`;
  }

  irParaDetalhe(id: number): void {
    this.router.navigate(['/corretoras', id]);
  }

  indiceGlobal(i: number): number {
    return (this.currentPage() - 1) * this.pageSize + i + 1;
  }
}
