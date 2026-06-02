import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Carteira } from '../models/carteira.model';
import { Operacao } from '../models/operacao.model';

@Injectable({ providedIn: 'root' })
export class CarteiraService {
  private readonly http = inject(HttpClient);

  cadastrar(nome: string, corretoraId: number): Observable<Carteira> {
    return this.http.post<Carteira>('/api/carteiras', { nome, corretoraId });
  }

  listar(): Observable<Carteira[]> {
    return this.http.get<Carteira[]>('/api/carteiras');
  }

  buscarPorId(id: number): Observable<Carteira> {
    return this.http.get<Carteira>(`/api/carteiras/${id}`);
  }

  comprar(id: number, ticker: string, qtd: number): Observable<void> {
    return this.http.post<void>(`/api/carteiras/${id}/comprar`, {
      ticker,
      quantidade: qtd,
    });
  }

  vender(id: number, ticker: string, qtd: number): Observable<void> {
    return this.http.post<void>(`/api/carteiras/${id}/vender`, {
      ticker,
      quantidade: qtd,
    });
  }

  listarOperacoes(id: number): Observable<Operacao[]> {
    return this.http.get<Operacao[]>(`/api/carteiras/${id}/operacoes`);
  }

  excluir(id: number): Observable<void> {
    return this.http.delete<void>(`/api/carteiras/${id}`);
  }
}
