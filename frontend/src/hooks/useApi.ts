import axios from 'axios';
import { CONFIG } from '../config';

const api = axios.create({ baseURL: CONFIG.API_URL });

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

export const AgendamentosAPI = {
  listar: (data?: string) =>
    api.get<Agendamento[]>('/agendamentos', { params: data ? { data } : {} }).then(r => r.data),

  ocupados: (data: string) =>
    api.get<{ data: string; ocupados: string[] }>('/agendamentos/ocupados', { params: { data } }).then(r => r.data),

  criar: (dto: Omit<Agendamento, 'id' | 'status' | 'criadoEm'>) =>
    api.post<Agendamento>('/agendamentos', dto).then(r => r.data),

  confirmar: (id: number) =>
    api.patch<Agendamento>(`/agendamentos/${id}/confirmar`).then(r => r.data),

  cancelar: (id: number) =>
    api.delete<{ ok: boolean }>(`/agendamentos/${id}`).then(r => r.data),
};

export const AuthAPI = {
  login: (senha: string) =>
    api.post<{ ok: boolean; token: string }>('/auth/login', { senha }).then(r => r.data),
};
