import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AcaoService } from '../../../core/services/acao.service';
import { Acao } from '../../../core/models/acao.model';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner';

@Component({
  selector: 'app-acao-list',
  imports: [RouterLink, LoadingSpinnerComponent],
  templateUrl: './acao-list.html',
  styleUrl: './acao-list.css',
})
export class AcaoListComponent implements OnInit {
  private readonly acaoService = inject(AcaoService);

  acoes = signal<Acao[]>([]);
  carregando = signal(true);
  searchQuery = signal('');
  currentPage = signal(1);
  atualizandoId = signal<number | null>(null);
  readonly pageSize = 10;

  filtradas = computed(() => {
    const q = this.searchQuery().toLowerCase().trim();
    return q
      ? this.acoes().filter(
          (a) => a.ticker.toLowerCase().includes(q) || a.nomeEmpresa.toLowerCase().includes(q),
        )
      : this.acoes();
  });

  paginadas = computed(() => {
    const start = (this.currentPage() - 1) * this.pageSize;
    return this.filtradas().slice(start, start + this.pageSize);
  });

  totalPages = computed(() => Math.ceil(this.filtradas().length / this.pageSize));
  pages = computed(() => Array.from({ length: this.totalPages() }, (_, i) => i + 1));

  ngOnInit(): void {
    this.acaoService.listar().subscribe({
      next: (data) => {
        this.acoes.set(data);
        this.carregando.set(false);
      },
      error: () => this.carregando.set(false),
    });
  }

  onSearch(event: Event): void {
    this.searchQuery.set((event.target as HTMLInputElement).value);
    this.currentPage.set(1);
  }

  indiceGlobal(i: number): number {
    return (this.currentPage() - 1) * this.pageSize + i + 1;
  }

  atualizarCotacao(acao: Acao): void {
    this.atualizandoId.set(acao.id);
    this.acaoService.atualizarCotacao(acao.id).subscribe({
      next: (atualizada) => {
        this.acoes.update((list) => list.map((a) => (a.id === acao.id ? atualizada : a)));
        this.atualizandoId.set(null);
      },
      error: () => this.atualizandoId.set(null),
    });
  }

  formatarCotacao(acao: Acao): string {
    const currency = acao.mercado === 'EUA' ? 'USD' : 'BRL';
    return acao.cotacaoAtual.toLocaleString('pt-BR', { style: 'currency', currency });
  }

  formatarDataHora(data: string): string {
    return new Date(data).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }
}
