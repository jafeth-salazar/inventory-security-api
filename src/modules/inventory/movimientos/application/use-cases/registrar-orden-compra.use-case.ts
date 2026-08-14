import { Inject, Injectable } from '@nestjs/common';

import { OrdenCompra } from '../../domain/entities/orden-compra.entity';
import {
  DatosRegistrarOrdenCompra,
  ORDEN_COMPRA_REPOSITORY,
} from '../../domain/ports/orden-compra-repository.port';
import type { OrdenCompraRepositoryPort } from '../../domain/ports/orden-compra-repository.port';

@Injectable()
export class RegistrarOrdenCompra {
  constructor(
    @Inject(ORDEN_COMPRA_REPOSITORY)
    private readonly ordenCompraRepository: OrdenCompraRepositoryPort,
  ) {}

  async ejecutar(datos: DatosRegistrarOrdenCompra): Promise<OrdenCompra> {
    return this.ordenCompraRepository.registrar(datos);
  }
}
