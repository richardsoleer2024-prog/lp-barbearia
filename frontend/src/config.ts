export const CONFIG = {
  WPP_BARBEIRO: '5548996985446',

  HORARIOS: [
    '08:00','08:30','09:00','09:30','10:00','10:30','11:00','11:30',
    '12:00','12:30','13:00','13:30','14:00','14:30','15:00','15:30',
    '16:00','16:30','17:00','17:30','18:00','18:30','19:00','19:30',
  ],

  DIA_FOLGA: 1, // Segunda-feira

  SERVICOS: [
    { id: 1, nome: 'Corte de cabelo', preco: 40, min: 30, icon: '✂️', desc: 'Tesoura ou máquina, do clássico ao moderno.' },
    { id: 2, nome: 'Barba',           preco: 30, min: 20, icon: '🪒', desc: 'Navalha ou máquina, com toalha quente e acabamento premium.' },
    { id: 3, nome: 'Cabelo + Barba',  preco: 70, min: 45, icon: '💈', desc: 'O combo completo. O pacote favorito dos clientes.' },
  ],

  // Lê a URL da API da variável de ambiente do Vite
  // Em dev: usa o proxy do vite.config.ts (aponta pra localhost:3001)
  // Em produção: usa VITE_API_URL do painel do Vercel
  get API_URL() {
    return import.meta.env.VITE_API_URL || '/api';
  },
};

export const MESES = [
  'Janeiro','Fevereiro','Março','Abril','Maio','Junho',
  'Julho','Agosto','Setembro','Outubro','Novembro','Dezembro',
];
export const MESES_ABR = ['jan','fev','mar','abr','mai','jun','jul','ago','set','out','nov','dez'];
export const DIAS_SEMANA = ['Dom','Seg','Ter','Qua','Qui','Sex','Sáb'];
