import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import type { Response } from 'express';

import { StockInsuficienteError } from '../../../inventory/movimientos/domain/errors/stock-insuficiente.error';
import { CredencialesInvalidasError } from '../../domain/errors/credenciales-invalidas.error';
import { EntidadNoEncontradaError } from '../../domain/errors/entidad-no-encontrada.error';

// Único "sink" del proyecto que conoce todos los errores de dominio para
// mapearlos a HTTP — igual que el SqlSessionGuard global. No repliques este
// conocimiento en los controllers.
@Catch(
  EntidadNoEncontradaError,
  StockInsuficienteError,
  CredencialesInvalidasError,
)
export class DomainErrorFilter implements ExceptionFilter {
  catch(error: Error, host: ArgumentsHost): void {
    const response = host.switchToHttp().getResponse<Response>();
    const status = this.statusFor(error);
    response
      .status(status)
      .json({ statusCode: status, message: error.message });
  }

  private statusFor(error: Error): number {
    if (error instanceof EntidadNoEncontradaError) {
      return 404;
    }
    if (error instanceof StockInsuficienteError) {
      return 400;
    }
    return 401;
  }
}
