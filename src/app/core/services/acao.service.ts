import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Acao } from '../models/acao.model';

@Injectable({ providedIn: 'root' })
export class AcaoService {
  private readonly http = inject(HttpClient);

  cadastrar(ticker: string, mercado: string): Observable<Acao> {
    return this.http.post<Acao>('/api/acoes', { ticker, mercado });
  }

  listar(): Observable<Acao[]> {
    return this.http.get<Acao[]>('/api/acoes');
  }

  buscarPorId(id: number): Observable<Acao> {
    return this.http.get<Acao>(`/api/acoes/${id}`);
  }

  buscarPorTicker(ticker: string): Observable<Acao> {
    return this.http.get<Acao>(`/api/acoes/ticker/${ticker}`);
  }

  atualizarCotacao(id: number): Observable<Acao> {
    return this.http.put<Acao>(`/api/acoes/${id}/atualizar-cotacao`, {});
  }
}
