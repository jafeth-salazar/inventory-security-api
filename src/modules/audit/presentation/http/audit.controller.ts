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
      hasta: filtros.hasta ? this.finalDelRango(filtros.hasta) : undefined,
      usuario: filtros.usuario,
    });
  }

  // Un "hasta" de solo fecha (sin hora, como manda <input type="date">) cae
  // en medianoche UTC — filtrar con <= contra eso excluye casi todo ese día.
  // Si viene con hora explícita (ISO completo), se respeta tal cual.
  private finalDelRango(hasta: string): Date {
    if (/^\d{4}-\d{2}-\d{2}$/.test(hasta)) {
      const fin = new Date(hasta);
      fin.setUTCHours(23, 59, 59, 999);
      return fin;
    }
    return new Date(hasta);
  }
}
