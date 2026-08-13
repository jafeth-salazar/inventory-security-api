import { Injectable, Scope } from '@nestjs/common';

import { CurrentSqlSession } from '../../../../shared/infrastructure/sql-session/current-sql-session';
import { RegistroAuditoria } from '../../../domain/entities/registro-auditoria.entity';
import { TablaAuditoria } from '../../../domain/entities/tabla-auditoria';
import {
  AuditoriaRepositoryPort,
  FiltrosConsultaAuditoria,
} from '../../../domain/ports/auditoria-repository.port';

const COLUMNAS_AUDITORIA = new Set([
  'idauditoria',
  'movimiento',
  'usuario_aud',
  'fecha_aud',
  'equipoorigen',
  'iporigen',
]);

@Injectable({ scope: Scope.REQUEST })
export class TypeOrmAuditoriaRepository implements AuditoriaRepositoryPort {
  constructor(private readonly currentSqlSession: CurrentSqlSession) {}

  async consultar(
    tabla: TablaAuditoria,
    filtros: FiltrosConsultaAuditoria,
  ): Promise<RegistroAuditoria[]> {
    // `tabla` ya viene validada contra la lista blanca TABLAS_AUDITORIA en
    // AuditController antes de llegar acá — nunca se interpola un nombre de
    // tabla que no haya pasado por esa validación.
    const condiciones: string[] = [];
    const parametros: unknown[] = [];

    if (filtros.accion) {
      condiciones.push(`Movimiento = @${parametros.length}`);
      parametros.push(filtros.accion);
    }
    if (filtros.desde) {
      condiciones.push(`Fecha_aud >= @${parametros.length}`);
      parametros.push(filtros.desde);
    }
    if (filtros.hasta) {
      condiciones.push(`Fecha_aud <= @${parametros.length}`);
      parametros.push(filtros.hasta);
    }
    if (filtros.usuario) {
      condiciones.push(`Usuario_Aud = @${parametros.length}`);
      parametros.push(filtros.usuario);
    }

    const where = condiciones.length
      ? `WHERE ${condiciones.join(' AND ')}`
      : '';
    const filas: Array<Record<string, unknown>> = await this.currentSqlSession
      .getDataSource()
      .query(
        `SELECT * FROM audit.${tabla} ${where} ORDER BY IdAuditoria DESC`,
        parametros,
      );

    return filas.map((fila) => this.toDomain(fila));
  }

  private toDomain(fila: Record<string, unknown>): RegistroAuditoria {
    const datos: Record<string, unknown> = {};
    for (const [clave, valor] of Object.entries(fila)) {
      if (!COLUMNAS_AUDITORIA.has(clave.toLowerCase())) {
        datos[clave] = valor;
      }
    }

    return new RegistroAuditoria(
      fila.IdAuditoria as number,
      fila.Movimiento as string,
      (fila.Usuario_Aud as string | null) ?? null,
      fila.Fecha_aud as Date,
      (fila.EquipoOrigen as string | null) ?? null,
      (fila.IPOrigen as string | null) ?? null,
      datos,
    );
  }
}
