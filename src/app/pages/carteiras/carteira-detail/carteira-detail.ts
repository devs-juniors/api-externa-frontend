import { Component, OnDestroy, OnInit, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { DecimalPipe } from '@angular/common';
import { CarteiraService } from '../../../core/services/carteira.service';
import { CambioService } from '../../../core/services/cambio.service';
import { Carteira } from '../../../core/models/carteira.model';
import { CarteiraAcaoResponse } from '../../../core/models/carteira-acao.model';
import { CurrencyBrPipe } from '../../../shared/pipes/currency-br.pipe';

type TipoModal = 'comprar' | 'vender' | 'nova-compra' | null;

@Component({
  selector: 'app-carteira-detail',
  imports: [RouterLink, CurrencyBrPipe, DecimalPipe],
  templateUrl: './carteira-detail.html',
  styleUrl: './carteira-detail.css',
  host: { '(document:keydown.escape)': 'fecharModal()' },
})
export class CarteiraDetailComponent implements OnInit, OnDestroy {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly carteiraService = inject(CarteiraService);
  private readonly cambioService = inject(CambioService);

  carteira = signal<Carteira | null>(null);
  carregando = signal(true);
  taxaUSD = signal<number>(1);

  totalPosicoes = computed(() => this.carteira()?.posicoes.length ?? 0);

  valorTotalInvestido = computed(() =>
    this.carteira()?.posicoes.reduce((s, p) => {
      const valor = p.moeda === 'USD' ? p.valorTotalInvestido * this.taxaUSD() : p.valorTotalInvestido;
      return s + valor;
    }, 0) ?? 0,
  );

  lucroTotal = computed(() =>
    this.carteira()?.posicoes.reduce((s, p) => {
      const lucro = p.moeda === 'USD' ? p.lucroOuPrejuizo * this.taxaUSD() : p.lucroOuPrejuizo;
      return s + lucro;
    }, 0) ?? 0,
  );

  modalAberto = signal<TipoModal>(null);
  posicaoModal = signal<CarteiraAcaoResponse | null>(null);
  modalQuantidade = signal('');
  modalTicker = signal('');
  modalEnviando = signal(false);
  modalErro = signal<string | null>(null);

  simboloMoedaAtual = computed(() => (this.posicaoModal()?.moeda === 'USD' ? 'US$' : 'R$'));

  private carteiraId!: number;

  ngOnInit(): void {
    this.carteiraId = Number(this.route.snapshot.paramMap.get('id'));
    this.carregarCarteira();
    this.cambioService.buscarTaxaUSDParaBRL().subscribe((taxa) => this.taxaUSD.set(taxa));
  }

  ngOnDestroy(): void {
    document.body.style.overflow = '';
  }

  private carregarCarteira(): void {
    this.carregando.set(true);
    this.carteiraService.buscarPorId(this.carteiraId).subscribe({
      next: (data) => {
        this.carteira.set(data);
        this.carregando.set(false);
      },
      error: () => this.carregando.set(false),
    });
  }

  abrirNovaCompra(): void {
    this.posicaoModal.set(null);
    this.modalTicker.set('');
    this.modalQuantidade.set('');
    this.modalErro.set(null);
    this.modalAberto.set('nova-compra');
    document.body.style.overflow = 'hidden';
  }

  abrirComprar(posicao: CarteiraAcaoResponse): void {
    this.posicaoModal.set(posicao);
    this.modalQuantidade.set('');
    this.modalErro.set(null);
    this.modalAberto.set('comprar');
    document.body.style.overflow = 'hidden';
  }

  abrirVender(posicao: CarteiraAcaoResponse): void {
    this.posicaoModal.set(posicao);
    this.modalQuantidade.set('');
    this.modalErro.set(null);
    this.modalAberto.set('vender');
    document.body.style.overflow = 'hidden';
  }

  fecharModal(): void {
    if (!this.modalAberto()) return;
    this.modalAberto.set(null);
    this.posicaoModal.set(null);
    this.modalEnviando.set(false);
    document.body.style.overflow = '';
  }

  onQuantidadeChange(event: Event): void {
    this.modalQuantidade.set((event.target as HTMLInputElement).value);
  }

  onTickerChange(event: Event): void {
    this.modalTicker.set((event.target as HTMLInputElement).value.toUpperCase());
  }

  confirmarCompra(): void {
    const ticker =
      this.modalAberto() === 'nova-compra' ? this.modalTicker() : this.posicaoModal()!.ticker;
    const qtd = parseFloat(this.modalQuantidade());

    if (this.modalAberto() === 'nova-compra' && !ticker.trim()) {
      this.modalErro.set('Informe o ticker da ação.');
      return;
    }

    if (isNaN(qtd) || qtd <= 0) {
      this.modalErro.set('Informe uma quantidade válida.');
      return;
    }

    this.modalEnviando.set(true);
    this.modalErro.set(null);

    this.carteiraService.comprar(this.carteiraId, ticker, qtd).subscribe({
      next: () => {
        this.fecharModal();
        this.carregarCarteira();
      },
      error: (err) => {
        this.modalErro.set(err?.error?.message ?? 'Erro ao registrar compra.');
        this.modalEnviando.set(false);
      },
    });
  }

  confirmarVenda(): void {
    const posicao = this.posicaoModal()!;
    const qtd = parseFloat(this.modalQuantidade());
    const maxQtd = posicao.quantidadeAtual;

    if (isNaN(qtd) || qtd <= 0 || qtd > maxQtd) {
      this.modalErro.set(`Quantidade inválida. Disponível: ${maxQtd} ações.`);
      return;
    }

    this.modalEnviando.set(true);
    this.modalErro.set(null);

    this.carteiraService.vender(this.carteiraId, posicao.ticker, qtd).subscribe({
      next: () => {
        this.fecharModal();
        this.carregarCarteira();
      },
      error: (err) => {
        this.modalErro.set(err?.error?.message ?? 'Erro ao registrar venda.');
        this.modalEnviando.set(false);
      },
    });
  }

  verOperacoes(posicaoId: number): void {
    this.router.navigate(['/operacoes'], { queryParams: { carteiraAcaoId: posicaoId } });
  }

  formatarMoeda(valor: number): string {
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }

  formatarPercentual(valor: number): string {
    const sinal = valor >= 0 ? '+' : '';
    return `${sinal}${valor.toFixed(2)}%`;
  }
}
