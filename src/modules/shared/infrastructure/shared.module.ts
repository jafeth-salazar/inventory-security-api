import { Global, Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt';

import { SQL_SESSION_PORT } from '../domain/ports/sql-session.port';

import { CurrentSqlSession } from './sql-session/current-sql-session';
import { SqlSessionGuard } from './sql-session/sql-session.guard';
import { TypeOrmSqlSessionAdapter } from './sql-session/typeorm-sql-session.adapter';

@Global()
@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET,
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
  ],
  exports: [SQL_SESSION_PORT, CurrentSqlSession, JwtModule],
})
export class SharedModule {}
