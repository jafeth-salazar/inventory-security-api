import { Controller, Get, Param } from '@nestjs/common';

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
    return this.obtenerInventarioActualPorId.ejecutar(id);
  }
}
