import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import { CorretoraService } from '../../core/services/corretora.service';
import { AcaoService } from '../../core/services/acao.service';
import { CarteiraService } from '../../core/services/carteira.service';

@Component({
  selector: 'app-dashboard',
  imports: [RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class DashboardComponent implements OnInit {
  private readonly corretoraService = inject(CorretoraService);
  private readonly acaoService = inject(AcaoService);
  private readonly carteiraService = inject(CarteiraService);

  totalCorretoras = signal<number | null>(null);
  totalAcoes = signal<number | null>(null);
  totalCarteiras = signal<number | null>(null);
  carregando = signal(true);

  ngOnInit(): void {
    forkJoin({
      corretoras: this.corretoraService.listar(),
      acoes: this.acaoService.listar(),
      carteiras: this.carteiraService.listar(),
    }).subscribe({
      next: ({ corretoras, acoes, carteiras }) => {
        this.totalCorretoras.set(corretoras.length);
        this.totalAcoes.set(acoes.length);
        this.totalCarteiras.set(carteiras.length);
        this.carregando.set(false);
      },
      error: () => this.carregando.set(false),
    });
  }
}
