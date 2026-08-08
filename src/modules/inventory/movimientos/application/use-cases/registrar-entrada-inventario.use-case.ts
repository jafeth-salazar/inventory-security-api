import { Inject, Injectable } from '@nestjs/common';

import { EntradaInventario } from '../../domain/entities/entrada-inventario.entity';
import {
  DatosRegistrarEntradaInventario,
  ENTRADA_INVENTARIO_REPOSITORY,
} from '../../domain/ports/entrada-inventario-repository.port';
import type { EntradaInventarioRepositoryPort } from '../../domain/ports/entrada-inventario-repository.port';
import { INVENTARIO_ACTUAL_REPOSITORY } from '../../domain/ports/inventario-actual-repository.port';
import type { InventarioActualRepositoryPort } from '../../domain/ports/inventario-actual-repository.port';

@Injectable()
export class RegistrarEntradaInventario {
  constructor(
    @Inject(ENTRADA_INVENTARIO_REPOSITORY)
    private readonly entradaInventarioRepository: EntradaInventarioRepositoryPort,
    @Inject(INVENTARIO_ACTUAL_REPOSITORY)
    private readonly inventarioActualRepository: InventarioActualRepositoryPort,
  ) {}

  async ejecutar(
    datos: DatosRegistrarEntradaInventario,
  ): Promise<EntradaInventario> {
    const inventarioActual =
      await this.inventarioActualRepository.obtenerPorProductoYBodega(
        datos.productoId,
        datos.bodegaId,
      );
    const cantidadActual = inventarioActual?.cantidadActual ?? 0;
    const nuevaCantidadActual = cantidadActual + datos.cantidad;

    return this.entradaInventarioRepository.registrarConActualizacionDeStock(
      datos,
      nuevaCantidadActual,
    );
  }
}
