import { Inject, Injectable } from '@nestjs/common';

import { OrdenCompra } from '../../domain/entities/orden-compra.entity';
import { ORDEN_COMPRA_REPOSITORY } from '../../domain/ports/orden-compra-repository.port';
import type { OrdenCompraRepositoryPort } from '../../domain/ports/orden-compra-repository.port';

@Injectable()
export class ListarOrdenesCompra {
  constructor(
    @Inject(ORDEN_COMPRA_REPOSITORY)
    private readonly ordenCompraRepository: OrdenCompraRepositoryPort,
  ) {}

  async ejecutar(): Promise<OrdenCompra[]> {
    return this.ordenCompraRepository.listar();
  }
}
