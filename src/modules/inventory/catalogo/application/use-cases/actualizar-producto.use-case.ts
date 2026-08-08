import { Inject, Injectable } from '@nestjs/common';

import { EntidadNoEncontradaError } from '../../../../shared/domain/errors/entidad-no-encontrada.error';
import { Producto } from '../../domain/entities/producto.entity';
import { PRODUCTO_REPOSITORY } from '../../domain/ports/producto-repository.port';
import type {
  DatosActualizarProducto,
  ProductoRepositoryPort,
} from '../../domain/ports/producto-repository.port';

@Injectable()
export class ActualizarProducto {
  constructor(
    @Inject(PRODUCTO_REPOSITORY)
    private readonly productoRepository: ProductoRepositoryPort,
  ) {}

  async ejecutar(
    id: string,
    cambios: DatosActualizarProducto,
  ): Promise<Producto> {
    const existente = await this.productoRepository.obtenerPorId(id);
    if (!existente) {
      throw new EntidadNoEncontradaError('Producto', id);
    }
    return this.productoRepository.actualizar(id, cambios);
  }
}
