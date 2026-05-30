import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CorretoraService } from '../../../core/services/corretora.service';
import { BreadcrumbComponent, BreadcrumbItem } from '../../../shared/components/breadcrumb/breadcrumb';

@Component({
  selector: 'app-corretora-form',
  imports: [RouterLink, BreadcrumbComponent],
  templateUrl: './corretora-form.html',
  styleUrl: './corretora-form.css',
})
export class CorretoraFormComponent {
  private readonly corretoraService = inject(CorretoraService);
  private readonly router = inject(Router);

  readonly breadcrumb: BreadcrumbItem[] = [
    { label: 'Início', url: '/dashboard' },
    { label: 'Corretoras', url: '/corretoras' },
    { label: 'Nova Corretora' },
  ];

  cnpjFormatado = signal('');
  cnpjDigitos = signal('');
  enviando = signal(false);
  erro = signal<string | null>(null);
  sucesso = signal(false);

  onCnpjInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const digits = input.value.replace(/\D/g, '').slice(0, 14);
    const masked = this.aplicarMascara(digits);
    this.cnpjFormatado.set(masked);
    this.cnpjDigitos.set(digits);
    input.value = masked;
  }

  private aplicarMascara(d: string): string {
    if (d.length <= 2) return d;
    if (d.length <= 5) return `${d.slice(0, 2)}.${d.slice(2)}`;
    if (d.length <= 8) return `${d.slice(0, 2)}.${d.slice(2, 5)}.${d.slice(5)}`;
    if (d.length <= 12) return `${d.slice(0, 2)}.${d.slice(2, 5)}.${d.slice(5, 8)}/${d.slice(8)}`;
    return `${d.slice(0, 2)}.${d.slice(2, 5)}.${d.slice(5, 8)}/${d.slice(8, 12)}-${d.slice(12)}`;
  }

  cadastrar(): void {
    if (this.cnpjDigitos().length !== 14) {
      this.erro.set('Informe um CNPJ válido com 14 dígitos.');
      return;
    }

    this.enviando.set(true);
    this.erro.set(null);

    this.corretoraService.cadastrar(this.cnpjDigitos()).subscribe({
      next: () => {
        this.sucesso.set(true);
        setTimeout(() => this.router.navigate(['/corretoras']), 1500);
      },
      error: (err) => {
        this.erro.set(err?.error?.message ?? 'Erro ao cadastrar corretora. Verifique o CNPJ e tente novamente.');
        this.enviando.set(false);
      },
    });
  }
}
