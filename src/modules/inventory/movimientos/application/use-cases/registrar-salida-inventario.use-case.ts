import { Inject, Injectable } from '@nestjs/common';

import { SalidaInventario } from '../../domain/entities/salida-inventario.entity';
import { StockInsuficienteError } from '../../domain/errors/stock-insuficiente.error';
import { INVENTARIO_ACTUAL_REPOSITORY } from '../../domain/ports/inventario-actual-repository.port';
import type { InventarioActualRepositoryPort } from '../../domain/ports/inventario-actual-repository.port';
import {
  DatosRegistrarSalidaInventario,
  SALIDA_INVENTARIO_REPOSITORY,
} from '../../domain/ports/salida-inventario-repository.port';
import type { SalidaInventarioRepositoryPort } from '../../domain/ports/salida-inventario-repository.port';

@Injectable()
export class RegistrarSalidaInventario {
  constructor(
    @Inject(SALIDA_INVENTARIO_REPOSITORY)
    private readonly salidaInventarioRepository: SalidaInventarioRepositoryPort,
    @Inject(INVENTARIO_ACTUAL_REPOSITORY)
    private readonly inventarioActualRepository: InventarioActualRepositoryPort,
  ) {}

  async ejecutar(
    datos: DatosRegistrarSalidaInventario,
  ): Promise<SalidaInventario> {
    const inventarioActual =
      await this.inventarioActualRepository.obtenerPorProductoYBodega(
        datos.productoId,
        datos.bodegaId,
      );
    const cantidadDisponible = inventarioActual?.cantidadActual ?? 0;

    if (cantidadDisponible < datos.cantidad) {
      throw new StockInsuficienteError(
        datos.productoId,
        datos.bodegaId,
        datos.cantidad,
        cantidadDisponible,
      );
    }

    const nuevaCantidadActual = cantidadDisponible - datos.cantidad;
    return this.salidaInventarioRepository.registrarConActualizacionDeStock(
      datos,
      nuevaCantidadActual,
    );
  }
}
