import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, catchError, of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CambioService {
  private readonly http = inject(HttpClient);

  buscarTaxaUSDParaBRL(): Observable<number> {
    return this.http
      .get<{ USDBRL: { bid: string } }>('/awesomeapi/last/USD-BRL')
      .pipe(
        map((res) => parseFloat(res.USDBRL.bid)),
        catchError(() => of(1)),
      );
  }
}
