import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Corretora } from '../models/corretora.model';

@Injectable({ providedIn: 'root' })
export class CorretoraService {
  private readonly http = inject(HttpClient);

  cadastrar(cnpj: string): Observable<Corretora> {
    return this.http.post<Corretora>('/api/corretoras', { cnpj });
  }

  listar(): Observable<Corretora[]> {
    return this.http.get<Corretora[]>('/api/corretoras');
  }

  buscarPorId(id: number): Observable<Corretora> {
    return this.http.get<Corretora>(`/api/corretoras/${id}`);
  }

  buscarPorCnpj(cnpj: string): Observable<Corretora> {
    return this.http.get<Corretora>(`/api/corretoras/cnpj/${cnpj}`);
  }

  excluir(id: number): Observable<void> {
    return this.http.delete<void>(`/api/corretoras/${id}`);
  }
}
