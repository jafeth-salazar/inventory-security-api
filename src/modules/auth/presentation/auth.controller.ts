import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UnauthorizedException,
} from '@nestjs/common';

import { CredencialesInvalidasError } from '../../shared/domain/errors/credenciales-invalidas.error';
import { Public } from '../../shared/infrastructure/sql-session/public.decorator';
import { AutenticarUsuario } from '../application/autenticar-usuario.use-case';

import { LoginRequestDto } from './dto/login-request.dto';
import { LoginResponseDto } from './dto/login-response.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly autenticarUsuario: AutenticarUsuario) {}

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() dto: LoginRequestDto): Promise<LoginResponseDto> {
    try {
      return await this.autenticarUsuario.ejecutar(dto.usuario, dto.password);
    } catch (error) {
      if (error instanceof CredencialesInvalidasError) {
        throw new UnauthorizedException(error.message);
      }
      throw error;
    }
  }
}
