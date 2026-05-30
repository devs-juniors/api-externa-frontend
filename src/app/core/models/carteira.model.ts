import { CarteiraAcaoResponse } from './carteira-acao.model';

export interface Carteira {
  id: number;
  nome: string;
  nomeCorretora: string;
  dataCriacao: string;
  posicoes: CarteiraAcaoResponse[];
}
