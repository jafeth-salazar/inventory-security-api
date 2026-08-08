import { Controller, Get, NotFoundException, Param } from '@nestjs/common';

import { EntidadNoEncontradaError } from '../../../../shared/domain/errors/entidad-no-encontrada.error';
import { ListarInventarioActual } from '../../application/use-cases/listar-inventario-actual.use-case';
import { ObtenerInventarioActualPorId } from '../../application/use-cases/obtener-inventario-actual-por-id.use-case';
import { InventarioActual } from '../../domain/entities/inventario-actual.entity';

@Controller('inventario-actual')
export class InventarioActualController {
  constructor(
    private readonly listarInventarioActual: ListarInventarioActual,
    private readonly obtenerInventarioActualPorId: ObtenerInventarioActualPorId,
  ) {}

  @Get()
  async listar(): Promise<InventarioActual[]> {
    return this.listarInventarioActual.ejecutar();
  }

  @Get(':id')
  async obtener(@Param('id') id: string): Promise<InventarioActual> {
    try {
      return await this.obtenerInventarioActualPorId.ejecutar(id);
    } catch (error) {
      if (error instanceof EntidadNoEncontradaError) {
        throw new NotFoundException(error.message);
      }
      throw error;
    }
  }
}
