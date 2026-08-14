import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
} from '@nestjs/common';
import type { Request } from 'express';

import type { OrigenConexion } from '../../shared/domain/ports/sql-session.port';
import { CurrentSqlSession } from '../../shared/infrastructure/sql-session/current-sql-session';
import { Public } from '../../shared/infrastructure/sql-session/public.decorator';
import { AutenticarUsuario } from '../application/autenticar-usuario.use-case';
import { CerrarSesion } from '../application/cerrar-sesion.use-case';

import { LoginRequestDto } from './dto/login-request.dto';
import { LoginResponseDto } from './dto/login-response.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly autenticarUsuario: AutenticarUsuario,
    private readonly cerrarSesion: CerrarSesion,
    private readonly currentSqlSession: CurrentSqlSession,
  ) {}

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() dto: LoginRequestDto,
    @Req() request: Request,
  ): Promise<LoginResponseDto> {
    const origen: OrigenConexion = {
      ip: request.ip ?? null,
      equipo: (request.headers['user-agent'] as string) ?? null,
    };
    return this.autenticarUsuario.ejecutar(dto.usuario, dto.password, origen);
  }

  @Post('logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  async logout(): Promise<void> {
    await this.cerrarSesion.ejecutar(this.currentSqlSession.getSessionId());
  }
}
