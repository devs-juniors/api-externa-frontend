export interface CarteiraAcaoResponse {
  id: number;
  ticker: string;
  nomeEmpresa: string;
  mercado: string;
  moeda: string;
  quantidadeAtual: number;
  precoMedioCompra: number;
  valorTotalInvestido: number;
  cotacaoAtual: number;
  lucroOuPrejuizo: number;
  percentualVariacao: number;
  precoMedioVenda: number | null;
  quantidadeVendida: number;
  lucroMedioPorAcao: number | null;
}
