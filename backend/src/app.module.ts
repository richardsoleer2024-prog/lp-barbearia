import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AgendamentosModule } from './agendamentos/agendamentos.module';
import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    AgendamentosModule,
    AuthModule,
  ],
})
export class AppModule {}
