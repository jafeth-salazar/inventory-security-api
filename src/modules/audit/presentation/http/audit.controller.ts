import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Query,
} from '@nestjs/common';

import { ListarBitacoraAuditoria } from '../../application/use-cases/listar-bitacora-auditoria.use-case';
import { RegistroAuditoria } from '../../domain/entities/registro-auditoria.entity';
import {
  esTablaAuditoriaValida,
  TABLAS_AUDITORIA,
} from '../../domain/entities/tabla-auditoria';

import { ConsultarAuditoriaDto } from './dto/consultar-auditoria.dto';

@Controller('audit')
export class AuditController {
  constructor(
    private readonly listarBitacoraAuditoria: ListarBitacoraAuditoria,
  ) {}

  // Menú de tablas disponibles para el visor — Parte 3.1 del enunciado.
  @Get('tablas')
  listarTablas(): readonly string[] {
    return TABLAS_AUDITORIA;
  }

  @Get(':tabla')
  async consultar(
    @Param('tabla') tabla: string,
    @Query() filtros: ConsultarAuditoriaDto,
  ): Promise<RegistroAuditoria[]> {
    if (!esTablaAuditoriaValida(tabla)) {
      throw new BadRequestException(
        `"${tabla}" no es una tabla de auditoría válida. Usá GET /audit/tablas para ver las disponibles.`,
      );
    }

    return this.listarBitacoraAuditoria.ejecutar(tabla, {
      accion: filtros.accion,
      desde: filtros.desde ? new Date(filtros.desde) : undefined,
      hasta: filtros.hasta ? new Date(filtros.hasta) : undefined,
      usuario: filtros.usuario,
    });
  }
}
