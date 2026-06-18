export interface Agendamento {
  id: number;
  nome: string;
  wpp: string;
  servico: string;
  preco: number;
  data: string;
  hora: string;
  status: 'pendente' | 'confirmado' | 'cancelado';
  criadoEm: string;
}

export class CriarAgendamentoDto {
  nome: string;
  wpp: string;
  servico: string;
  preco: number;
  data: string;
  hora: string;
}
