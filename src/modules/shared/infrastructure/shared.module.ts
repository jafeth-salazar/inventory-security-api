import { Global, Module } from '@nestjs/common';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt';

import { SQL_SESSION_PORT } from '../domain/ports/sql-session.port';

import { DomainErrorFilter } from './http/domain-error.filter';
import { CurrentSqlSession } from './sql-session/current-sql-session';
import { SqlSessionGuard } from './sql-session/sql-session.guard';
import { TypeOrmSqlSessionAdapter } from './sql-session/typeorm-sql-session.adapter';

const jwtSecret = process.env.JWT_SECRET;
if (!jwtSecret) {
  throw new Error(
    'JWT_SECRET no está definido — configuralo en .env (ver .env.example).',
  );
}

@Global()
@Module({
  imports: [
    JwtModule.register({
      secret: jwtSecret,
      signOptions: {
        expiresIn: process.env.JWT_EXPIRES_IN ?? '15m',
      } as JwtModuleOptions['signOptions'],
    }),
  ],
  providers: [
    TypeOrmSqlSessionAdapter,
    { provide: SQL_SESSION_PORT, useExisting: TypeOrmSqlSessionAdapter },
    CurrentSqlSession,
    { provide: APP_GUARD, useClass: SqlSessionGuard },
    { provide: APP_FILTER, useClass: DomainErrorFilter },
  ],
  exports: [SQL_SESSION_PORT, CurrentSqlSession, JwtModule],
})
export class SharedModule {}
