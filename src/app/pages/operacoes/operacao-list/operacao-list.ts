import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { OperacaoService } from '../../../core/services/operacao.service';
import { Operacao } from '../../../core/models/operacao.model';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner';
import { CurrencyBrPipe } from '../../../shared/pipes/currency-br.pipe';
import { DateBrPipe } from '../../../shared/pipes/date-br.pipe';

type Filtro = 'todas' | 'compras' | 'vendas';

@Component({
  selector: 'app-operacao-list',
  imports: [RouterLink, LoadingSpinnerComponent, CurrencyBrPipe, DateBrPipe],
  templateUrl: './operacao-list.html',
  styleUrl: './operacao-list.css',
})
export class OperacaoListComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly operacaoService = inject(OperacaoService);

  carteiraAcaoId = signal<number | null>(null);
  operacoes = signal<Operacao[]>([]);
  carregando = signal(false);
  filtroAtivo = signal<Filtro>('todas');
  currentPage = signal(1);
  readonly pageSize = 10;

  filtradas = computed(() => {
    const filtro = this.filtroAtivo();
    const ops = this.operacoes();
    if (filtro === 'compras') return ops.filter((o) => o.tipo === 'COMPRA');
    if (filtro === 'vendas') return ops.filter((o) => o.tipo === 'VENDA');
    return ops;
  });

  paginadas = computed(() => {
    const start = (this.currentPage() - 1) * this.pageSize;
    return this.filtradas().slice(start, start + this.pageSize);
  });

  totalPages = computed(() => Math.ceil(this.filtradas().length / this.pageSize));
  pages = computed(() => Array.from({ length: this.totalPages() }, (_, i) => i + 1));

  ngOnInit(): void {
    const idParam = this.route.snapshot.queryParamMap.get('carteiraAcaoId');
    if (idParam) {
      const id = Number(idParam);
      this.carteiraAcaoId.set(id);
      this.carregarOperacoes(id);
    }
  }

  private carregarOperacoes(id: number): void {
    this.carregando.set(true);
    this.operacaoService.listarPorCarteiraAcao(id).subscribe({
      next: (data) => {
        this.operacoes.set(data);
        this.carregando.set(false);
      },
      error: () => this.carregando.set(false),
    });
  }

  setFiltro(filtro: Filtro): void {
    this.filtroAtivo.set(filtro);
    this.currentPage.set(1);
  }

  indiceGlobal(i: number): number {
    return (this.currentPage() - 1) * this.pageSize + i + 1;
  }
}
