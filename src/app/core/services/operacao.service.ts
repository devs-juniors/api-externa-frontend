import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Operacao } from '../models/operacao.model';

@Injectable({ providedIn: 'root' })
export class OperacaoService {
  private readonly http = inject(HttpClient);

  listarPorCarteiraAcao(id: number): Observable<Operacao[]> {
    return this.http.get<Operacao[]>(`/api/operacoes/carteira-acao/${id}`);
  }

  listarCompras(id: number): Observable<Operacao[]> {
    return this.http.get<Operacao[]>(`/api/operacoes/carteira-acao/${id}/compras`);
  }

  listarVendas(id: number): Observable<Operacao[]> {
    return this.http.get<Operacao[]>(`/api/operacoes/carteira-acao/${id}/vendas`);
  }
}
