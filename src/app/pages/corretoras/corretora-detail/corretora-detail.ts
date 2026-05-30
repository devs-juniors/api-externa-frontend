import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CorretoraService } from '../../../core/services/corretora.service';
import { Corretora } from '../../../core/models/corretora.model';
import { BreadcrumbComponent, BreadcrumbItem } from '../../../shared/components/breadcrumb/breadcrumb';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner';

@Component({
  selector: 'app-corretora-detail',
  imports: [RouterLink, BreadcrumbComponent, LoadingSpinnerComponent],
  templateUrl: './corretora-detail.html',
  styleUrl: './corretora-detail.css',
})
export class CorretoraDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly corretoraService = inject(CorretoraService);

  corretora = signal<Corretora | null>(null);
  carregando = signal(true);
  breadcrumb = signal<BreadcrumbItem[]>([
    { label: 'Início', url: '/dashboard' },
    { label: 'Corretoras', url: '/corretoras' },
    { label: '...' },
  ]);

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.corretoraService.buscarPorId(id).subscribe({
      next: (data) => {
        this.corretora.set(data);
        this.breadcrumb.set([
          { label: 'Início', url: '/dashboard' },
          { label: 'Corretoras', url: '/corretoras' },
          { label: data.razaoSocial },
        ]);
        this.carregando.set(false);
      },
      error: () => this.carregando.set(false),
    });
  }

  formatarCnpj(cnpj: string): string {
    const d = cnpj.replace(/\D/g, '');
    if (d.length !== 14) return cnpj;
    return `${d.slice(0, 2)}.${d.slice(2, 5)}.${d.slice(5, 8)}/${d.slice(8, 12)}-${d.slice(12)}`;
  }

  formatarData(data: string): string {
    return new Date(data).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }
}
