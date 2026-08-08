import { Inject, Injectable } from '@nestjs/common';

import { EntidadNoEncontradaError } from '../../../../shared/domain/errors/entidad-no-encontrada.error';
import { InventarioActual } from '../../domain/entities/inventario-actual.entity';
import { INVENTARIO_ACTUAL_REPOSITORY } from '../../domain/ports/inventario-actual-repository.port';
import type { InventarioActualRepositoryPort } from '../../domain/ports/inventario-actual-repository.port';

@Injectable()
export class ObtenerInventarioActualPorId {
  constructor(
    @Inject(INVENTARIO_ACTUAL_REPOSITORY)
    private readonly inventarioActualRepository: InventarioActualRepositoryPort,
  ) {}

  async ejecutar(id: string): Promise<InventarioActual> {
    const inventario = await this.inventarioActualRepository.obtenerPorId(id);
    if (!inventario) {
      throw new EntidadNoEncontradaError('InventarioActual', id);
    }
    return inventario;
  }
}
