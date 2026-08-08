import { Inject, Injectable } from '@nestjs/common';

import { SQL_SESSION_PORT } from '../../shared/domain/ports/sql-session.port';
import type { SqlSessionPort } from '../../shared/domain/ports/sql-session.port';

@Injectable()
export class CerrarSesion {
  constructor(
    @Inject(SQL_SESSION_PORT) private readonly sqlSessionPort: SqlSessionPort,
  ) {}

  ejecutar(sessionId: string): Promise<void> {
    return this.sqlSessionPort.closeSession(sessionId);
  }
}
