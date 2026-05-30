export interface Acao {
  id: number;
  ticker: string;
  nomeEmpresa: string;
  mercado: string;
  moeda: string;
  cotacaoAtual: number;
  dataHoraCotacao: string;
}
