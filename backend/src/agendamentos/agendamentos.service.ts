import { Injectable, BadRequestException, Inject } from '@nestjs/common';
import { Pool } from 'pg';
import { DB_POOL } from '../database/database.module';
import { Agendamento, CriarAgendamentoDto } from './agendamento.entity';

@Injectable()
export class AgendamentosService {
  constructor(@Inject(DB_POOL) private readonly db: Pool) {}

  async listarTodos(): Promise<Agendamento[]> {
    const { rows } = await this.db.query(
      `SELECT * FROM agendamentos WHERE status != 'cancelado' ORDER BY data, hora`
    );
    return rows.map(this.mapRow);
  }

  async listarPorData(data: string): Promise<Agendamento[]> {
    const { rows } = await this.db.query(
      `SELECT * FROM agendamentos WHERE data = $1 AND status != 'cancelado' ORDER BY hora`,
      [data]
    );
    return rows.map(this.mapRow);
  }

  async horariosOcupados(data: string): Promise<string[]> {
    const { rows } = await this.db.query(
      `SELECT hora FROM agendamentos WHERE data = $1 AND status != 'cancelado'`,
      [data]
    );
    return rows.map(r => r.hora);
  }

  async criar(dto: CriarAgendamentoDto): Promise<Agendamento> {
    // Verificar se horário já está ocupado
    const { rows } = await this.db.query(
      `SELECT id FROM agendamentos WHERE data = $1 AND hora = $2 AND status != 'cancelado'`,
      [dto.data, dto.hora]
    );
    if (rows.length > 0) throw new BadRequestException('Horário já ocupado.');

    const id = Date.now();
    const { rows: [novo] } = await this.db.query(
      `INSERT INTO agendamentos (id, nome, wpp, servico, preco, data, hora, status)
       VALUES ($1,$2,$3,$4,$5,$6,$7,'pendente') RETURNING *`,
      [id, dto.nome, dto.wpp, dto.servico, dto.preco, dto.data, dto.hora]
    );
    return this.mapRow(novo);
  }

  async confirmar(id: number): Promise<Agendamento> {
    const { rows } = await this.db.query(
      `UPDATE agendamentos SET status='confirmado' WHERE id=$1 RETURNING *`,
      [id]
    );
    if (!rows[0]) throw new BadRequestException('Agendamento não encontrado.');
    return this.mapRow(rows[0]);
  }

  async cancelar(id: number): Promise<{ ok: boolean }> {
    await this.db.query(
      `UPDATE agendamentos SET status='cancelado' WHERE id=$1`,
      [id]
    );
    return { ok: true };
  }

  private mapRow(row: any): Agendamento {
    return {
      id: Number(row.id),
      nome: row.nome,
      wpp: row.wpp,
      servico: row.servico,
      preco: row.preco,
      data: row.data instanceof Date
        ? row.data.toISOString().split('T')[0]
        : String(row.data).split('T')[0],
      hora: row.hora,
      status: row.status,
      criadoEm: row.criado_em,
    };
  }
}
