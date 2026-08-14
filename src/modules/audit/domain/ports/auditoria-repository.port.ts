import { RegistroAuditoria } from '../entities/registro-auditoria.entity';
import { TablaAuditoria } from '../entities/tabla-auditoria';

export interface FiltrosConsultaAuditoria {
  accion?: string;
  desde?: Date;
  hasta?: Date;
  usuario?: string;
}

export const AUDITORIA_REPOSITORY = Symbol('AUDITORIA_REPOSITORY');

export interface AuditoriaRepositoryPort {
  consultar(
    tabla: TablaAuditoria,
    filtros: FiltrosConsultaAuditoria,
  ): Promise<RegistroAuditoria[]>;
}
