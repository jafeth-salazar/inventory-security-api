import { Inject, Injectable } from '@nestjs/common';

import { Producto } from '../../domain/entities/producto.entity';
import { PRODUCTO_REPOSITORY } from '../../domain/ports/producto-repository.port';
import type {
  DatosCrearProducto,
  ProductoRepositoryPort,
} from '../../domain/ports/producto-repository.port';

@Injectable()
export class CrearProducto {
  constructor(
    @Inject(PRODUCTO_REPOSITORY)
    private readonly productoRepository: ProductoRepositoryPort,
  ) {}

  async ejecutar(datos: DatosCrearProducto): Promise<Producto> {
    return this.productoRepository.crear(datos);
  }
}
