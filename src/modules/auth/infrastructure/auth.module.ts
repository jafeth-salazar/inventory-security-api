import { Module } from '@nestjs/common';

import { AutenticarUsuario } from '../application/autenticar-usuario.use-case';
import { CerrarSesion } from '../application/cerrar-sesion.use-case';
import { AuthController } from '../presentation/auth.controller';

@Module({
  controllers: [AuthController],
  providers: [AutenticarUsuario, CerrarSesion],
})
export class AuthModule {}
