import { Controller, Get, Post, Patch, Delete, Body, Param, Query } from '@nestjs/common';
import { AgendamentosService } from './agendamentos.service';
import { CriarAgendamentoDto } from './agendamento.entity';

@Controller('agendamentos')
export class AgendamentosController {
  constructor(private readonly service: AgendamentosService) {}

  @Get()
  listar(@Query('data') data?: string) {
    if (data) return this.service.listarPorData(data);
    return this.service.listarTodos();
  }

  @Get('ocupados')
  async ocupados(@Query('data') data: string) {
    return { data, ocupados: await this.service.horariosOcupados(data) };
  }

  @Post()
  criar(@Body() dto: CriarAgendamentoDto) {
    return this.service.criar(dto);
  }

  @Patch(':id/confirmar')
  confirmar(@Param('id') id: string) {
    return this.service.confirmar(Number(id));
  }

  @Delete(':id')
  cancelar(@Param('id') id: string) {
    return this.service.cancelar(Number(id));
  }
}
