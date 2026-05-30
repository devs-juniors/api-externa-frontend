import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AcaoService } from '../../../core/services/acao.service';
import { BreadcrumbComponent, BreadcrumbItem } from '../../../shared/components/breadcrumb/breadcrumb';

@Component({
  selector: 'app-acao-form',
  imports: [RouterLink, BreadcrumbComponent],
  templateUrl: './acao-form.html',
  styleUrl: './acao-form.css',
})
export class AcaoFormComponent {
  private readonly acaoService = inject(AcaoService);
  private readonly router = inject(Router);

  readonly breadcrumb: BreadcrumbItem[] = [
    { label: 'Início', url: '/dashboard' },
    { label: 'Ações', url: '/acoes' },
    { label: 'Nova Ação' },
  ];

  ticker = signal('');
  mercado = signal('BR');
  enviando = signal(false);
  erro = signal<string | null>(null);
  sucesso = signal(false);

  onTickerInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const valor = input.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
    this.ticker.set(valor);
    input.value = valor;
  }

  onMercadoChange(event: Event): void {
    this.mercado.set((event.target as HTMLSelectElement).value);
  }

  cadastrar(): void {
    const ticker = this.ticker().trim();
    if (!ticker) {
      this.erro.set('Informe o ticker da ação.');
      return;
    }

    this.enviando.set(true);
    this.erro.set(null);

    this.acaoService.cadastrar(ticker, this.mercado()).subscribe({
      next: () => {
        this.sucesso.set(true);
        setTimeout(() => this.router.navigate(['/acoes']), 1500);
      },
      error: (err) => {
        this.erro.set(err?.error?.message ?? 'Erro ao cadastrar ação. Verifique o ticker e tente novamente.');
        this.enviando.set(false);
      },
    });
  }
}
