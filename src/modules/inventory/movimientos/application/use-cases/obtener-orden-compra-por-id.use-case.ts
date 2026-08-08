import { Inject, Injectable } from '@nestjs/common';

import { EntidadNoEncontradaError } from '../../../../shared/domain/errors/entidad-no-encontrada.error';
import { OrdenCompra } from '../../domain/entities/orden-compra.entity';
import { ORDEN_COMPRA_REPOSITORY } from '../../domain/ports/orden-compra-repository.port';
import type { OrdenCompraRepositoryPort } from '../../domain/ports/orden-compra-repository.port';

@Injectable()
export class ObtenerOrdenCompraPorId {
  constructor(
    @Inject(ORDEN_COMPRA_REPOSITORY)
    private readonly ordenCompraRepository: OrdenCompraRepositoryPort,
  ) {}

  async ejecutar(id: string): Promise<OrdenCompra> {
    const ordenCompra = await this.ordenCompraRepository.obtenerPorId(id);
    if (!ordenCompra) {
      throw new EntidadNoEncontradaError('OrdenCompra', id);
    }
    return ordenCompra;
  }
}
