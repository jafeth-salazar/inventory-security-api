import { Inject, Injectable } from '@nestjs/common';

import { RegistroAuditoria } from '../../domain/entities/registro-auditoria.entity';
import { TablaAuditoria } from '../../domain/entities/tabla-auditoria';
import { AUDITORIA_REPOSITORY } from '../../domain/ports/auditoria-repository.port';
import type {
  AuditoriaRepositoryPort,
  FiltrosConsultaAuditoria,
} from '../../domain/ports/auditoria-repository.port';

@Injectable()
export class ListarBitacoraAuditoria {
  constructor(
    @Inject(AUDITORIA_REPOSITORY)
    private readonly auditoriaRepository: AuditoriaRepositoryPort,
  ) {}

  ejecutar(
    tabla: TablaAuditoria,
    filtros: FiltrosConsultaAuditoria,
  ): Promise<RegistroAuditoria[]> {
    return this.auditoriaRepository.consultar(tabla, filtros);
  }
}
