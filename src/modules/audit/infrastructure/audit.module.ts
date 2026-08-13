import { Module } from '@nestjs/common';

import { ListarBitacoraAuditoria } from '../application/use-cases/listar-bitacora-auditoria.use-case';
import { AUDITORIA_REPOSITORY } from '../domain/ports/auditoria-repository.port';
import { AuditController } from '../presentation/http/audit.controller';

import { TypeOrmAuditoriaRepository } from './persistence/typeorm/typeorm-auditoria.repository';

@Module({
  controllers: [AuditController],
  providers: [
    { provide: AUDITORIA_REPOSITORY, useClass: TypeOrmAuditoriaRepository },
    ListarBitacoraAuditoria,
  ],
})
export class AuditModule {}
