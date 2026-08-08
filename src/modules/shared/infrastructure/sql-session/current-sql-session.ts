import {
  Inject,
  Injectable,
  Scope,
  UnauthorizedException,
} from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { DataSource } from 'typeorm';

import type { SqlSessionRequest } from './sql-session-request';

// Request-scoped: cada request trae su propio DataSource (el del login que
// abrió el SqlSessionGuard), así que los repositorios TypeORM concretos que
// inyecten esta clase se vuelven request-scoped también. Es el punto donde
// domain/application dejan de ver TypeORM y solo ven "la sesión actual".
@Injectable({ scope: Scope.REQUEST })
export class CurrentSqlSession {
  constructor(@Inject(REQUEST) private readonly request: SqlSessionRequest) {}

  getDataSource(): DataSource {
    return this.sesionActiva().dataSource;
  }

  getUsuario(): string {
    return this.sesionActiva().usuario;
  }

  private sesionActiva() {
    if (!this.request.sqlSession) {
      throw new UnauthorizedException(
        'No hay una sesión SQL activa para este request.',
      );
    }
    return this.request.sqlSession;
  }
}
