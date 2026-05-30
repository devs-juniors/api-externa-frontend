import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'currencyBr', standalone: true })
export class CurrencyBrPipe implements PipeTransform {
  transform(value: number, moeda: string = 'BRL'): string {
    const currency = moeda === 'USD' ? 'USD' : 'BRL';
    return value.toLocaleString('pt-BR', { style: 'currency', currency });
  }
}
