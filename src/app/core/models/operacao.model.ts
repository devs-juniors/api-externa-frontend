export interface Operacao {
  id: number;
  ticker: string;
  tipo: string;
  quantidade: number;
  precoUnitario: number;
  valorTotal: number;
  dataOperacao: string;
}
