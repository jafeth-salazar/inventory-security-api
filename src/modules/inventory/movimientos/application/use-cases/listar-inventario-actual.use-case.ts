import { Inject, Injectable } from '@nestjs/common';

import { InventarioActual } from '../../domain/entities/inventario-actual.entity';
import { INVENTARIO_ACTUAL_REPOSITORY } from '../../domain/ports/inventario-actual-repository.port';
import type { InventarioActualRepositoryPort } from '../../domain/ports/inventario-actual-repository.port';

@Injectable()
export class ListarInventarioActual {
  constructor(
    @Inject(INVENTARIO_ACTUAL_REPOSITORY)
    private readonly inventarioActualRepository: InventarioActualRepositoryPort,
  ) {}

  async ejecutar(): Promise<InventarioActual[]> {
    return this.inventarioActualRepository.listar();
  }
}
