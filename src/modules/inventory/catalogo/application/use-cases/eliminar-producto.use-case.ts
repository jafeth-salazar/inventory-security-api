import { Inject, Injectable } from '@nestjs/common';

import { EntidadNoEncontradaError } from '../../../../shared/domain/errors/entidad-no-encontrada.error';
import { PRODUCTO_REPOSITORY } from '../../domain/ports/producto-repository.port';
import type { ProductoRepositoryPort } from '../../domain/ports/producto-repository.port';

@Injectable()
export class EliminarProducto {
  constructor(
    @Inject(PRODUCTO_REPOSITORY)
    private readonly productoRepository: ProductoRepositoryPort,
  ) {}

  async ejecutar(id: string): Promise<void> {
    const existente = await this.productoRepository.obtenerPorId(id);
    if (!existente) {
      throw new EntidadNoEncontradaError('Producto', id);
    }
    await this.productoRepository.eliminar(id);
  }
}
