import { Component, OnInit, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CarteiraService } from '../../../core/services/carteira.service';
import { CorretoraService } from '../../../core/services/corretora.service';
import { Corretora } from '../../../core/models/corretora.model';

@Component({
  selector: 'app-carteira-form',
  imports: [RouterLink],
  templateUrl: './carteira-form.html',
  styleUrl: './carteira-form.css',
})
export class CarteiraFormComponent implements OnInit {
  private readonly carteiraService = inject(CarteiraService);
  private readonly corretoraService = inject(CorretoraService);
  private readonly router = inject(Router);

  corretoras = signal<Corretora[]>([]);
  nome = signal('');
  corretoraId = signal<number | null>(null);
  enviando = signal(false);
  erro = signal<string | null>(null);

  ngOnInit(): void {
    this.corretoraService.listar().subscribe({
      next: (data) => this.corretoras.set(data),
    });
  }

  onNomeChange(event: Event): void {
    this.nome.set((event.target as HTMLInputElement).value);
  }

  onCorretoraChange(event: Event): void {
    const val = (event.target as HTMLSelectElement).value;
    this.corretoraId.set(val ? Number(val) : null);
  }

  criar(): void {
    const nome = this.nome().trim();
    const corretoraId = this.corretoraId();

    if (!nome || !corretoraId) {
      this.erro.set('Preencha todos os campos obrigatórios.');
      return;
    }

    this.enviando.set(true);
    this.erro.set(null);

    this.carteiraService.cadastrar(nome, corretoraId).subscribe({
      next: () => this.router.navigate(['/carteiras']),
      error: (err) => {
        this.erro.set(err?.error?.message ?? 'Erro ao criar carteira. Tente novamente.');
        this.enviando.set(false);
      },
    });
  }
}
