import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { SQL_SESSION_PORT } from '../../shared/domain/ports/sql-session.port';
import type {
  OrigenConexion,
  SqlSessionPort,
} from '../../shared/domain/ports/sql-session.port';

export interface TokenDeSesion {
  accessToken: string;
}

@Injectable()
export class AutenticarUsuario {
  constructor(
    @Inject(SQL_SESSION_PORT) private readonly sqlSessionPort: SqlSessionPort,
    private readonly jwtService: JwtService,
  ) {}

  async ejecutar(
    usuario: string,
    password: string,
    origen: OrigenConexion,
  ): Promise<TokenDeSesion> {
    const sesion = await this.sqlSessionPort.authenticate(
      usuario,
      password,
      origen,
    );
    const accessToken = await this.jwtService.signAsync({
      sessionId: sesion.sessionId,
      usuario: sesion.usuario,
    });
    return { accessToken };
  }
}
