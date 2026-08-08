import { Inject, Injectable } from '@nestjs/common';

import { EntidadNoEncontradaError } from '../../../../shared/domain/errors/entidad-no-encontrada.error';
import { Producto } from '../../domain/entities/producto.entity';
import { PRODUCTO_REPOSITORY } from '../../domain/ports/producto-repository.port';
import type { ProductoRepositoryPort } from '../../domain/ports/producto-repository.port';

@Injectable()
export class ObtenerProductoPorId {
  constructor(
    @Inject(PRODUCTO_REPOSITORY)
    private readonly productoRepository: ProductoRepositoryPort,
  ) {}

  async ejecutar(id: string): Promise<Producto> {
    const producto = await this.productoRepository.obtenerPorId(id);
    if (!producto) {
      throw new EntidadNoEncontradaError('Producto', id);
    }
    return producto;
  }
}
