import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';

import { SesionNoEncontradaError } from '../../domain/errors/sesion-no-encontrada.error';

import { IS_PUBLIC_KEY } from './public.decorator';
import { SqlSessionRequest } from './sql-session-request';
import { TypeOrmSqlSessionAdapter } from './typeorm-sql-session.adapter';

interface SqlSessionJwtPayload {
  sessionId: string;
  usuario: string;
}

// Depende directamente del adapter concreto (no del SqlSessionPort de
// domain/ports): getDataSource() es una capacidad de infraestructura pura
// (expone un DataSource de TypeORM), no algo que application/ necesite ver.
@Injectable()
export class SqlSessionGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly jwtService: JwtService,
    private readonly sqlSessionAdapter: TypeOrmSqlSessionAdapter,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest<SqlSessionRequest>();
    const token = this.extractToken(request);
    if (!token) {
      throw new UnauthorizedException(
        'Falta el header Authorization: Bearer <token>.',
      );
    }

    let payload: SqlSessionJwtPayload;
    try {
      payload = await this.jwtService.verifyAsync<SqlSessionJwtPayload>(token);
    } catch {
      throw new UnauthorizedException('Token inválido o expirado.');
    }

    try {
      const dataSource = this.sqlSessionAdapter.getDataSource(
        payload.sessionId,
      );
      request.sqlSession = {
        sessionId: payload.sessionId,
        usuario: payload.usuario,
        dataSource,
      };
    } catch (error) {
      if (error instanceof SesionNoEncontradaError) {
        throw new UnauthorizedException(error.message);
      }
      throw error;
    }

    return true;
  }

  private extractToken(request: SqlSessionRequest): string | undefined {
    const header = request.headers.authorization;
    if (!header?.startsWith('Bearer ')) {
      return undefined;
    }
    return header.slice('Bearer '.length).trim();
  }
}
