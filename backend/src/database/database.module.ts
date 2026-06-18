import { Module, Global } from '@nestjs/common';
import { Pool } from 'pg';

export const DB_POOL = 'DB_POOL';

const dbProvider = {
  provide: DB_POOL,
  useFactory: async () => {
    const pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.NODE_ENV === 'production'
        ? { rejectUnauthorized: false }
        : false,
    });

    // Criar tabela de agendamentos se não existir
    await pool.query(`
      CREATE TABLE IF NOT EXISTS agendamentos (
        id         BIGINT PRIMARY KEY,
        nome       VARCHAR(200) NOT NULL,
        wpp        VARCHAR(50)  NOT NULL,
        servico    VARCHAR(100) NOT NULL,
        preco      INTEGER      NOT NULL,
        data       DATE         NOT NULL,
        hora       VARCHAR(5)   NOT NULL,
        status     VARCHAR(20)  NOT NULL DEFAULT 'pendente',
        criado_em  TIMESTAMPTZ  NOT NULL DEFAULT NOW()
      );
    `);

    console.log('✅ Banco de dados conectado e tabela verificada');
    return pool;
  },
};

@Global()
@Module({
  providers: [dbProvider],
  exports: [dbProvider],
})
export class DatabaseModule {}
