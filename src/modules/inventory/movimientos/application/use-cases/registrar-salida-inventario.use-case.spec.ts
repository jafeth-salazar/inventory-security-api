import { InventarioActual } from '../../domain/entities/inventario-actual.entity';
import { SalidaInventario } from '../../domain/entities/salida-inventario.entity';
import { StockInsuficienteError } from '../../domain/errors/stock-insuficiente.error';
import { InventarioActualRepositoryPort } from '../../domain/ports/inventario-actual-repository.port';
import {
  DatosRegistrarSalidaInventario,
  SalidaInventarioRepositoryPort,
} from '../../domain/ports/salida-inventario-repository.port';

import { RegistrarSalidaInventario } from './registrar-salida-inventario.use-case';

class InventarioActualRepositoryFake implements InventarioActualRepositoryPort {
  constructor(private readonly cantidadActual: number | null) {}

  listar(): Promise<InventarioActual[]> {
    return Promise.resolve([]);
  }

  obtenerPorId(): Promise<InventarioActual | null> {
    return Promise.resolve(null);
  }

  obtenerPorProductoYBodega(
    productoId: string,
    bodegaId: string,
  ): Promise<InventarioActual | null> {
    if (this.cantidadActual === null) {
      return Promise.resolve(null);
    }
    return Promise.resolve(
      new InventarioActual(
        'inventario-1',
        productoId,
        bodegaId,
        this.cantidadActual,
      ),
    );
  }
}

class SalidaInventarioRepositoryFake implements SalidaInventarioRepositoryPort {
  llamadas: Array<{
    datos: DatosRegistrarSalidaInventario;
    nuevaCantidadActual: number;
  }> = [];

  registrarConActualizacionDeStock(
    datos: DatosRegistrarSalidaInventario,
    nuevaCantidadActual: number,
  ): Promise<SalidaInventario> {
    this.llamadas.push({ datos, nuevaCantidadActual });
    return Promise.resolve(
      new SalidaInventario(
        'salida-1',
        datos.productoId,
        datos.bodegaId,
        datos.cantidad,
        datos.motivo,
        new Date(),
      ),
    );
  }

  listar(): Promise<SalidaInventario[]> {
    return Promise.resolve([]);
  }

  obtenerPorId(): Promise<SalidaInventario | null> {
    return Promise.resolve(null);
  }
}

describe('RegistrarSalidaInventario', () => {
  const datos: DatosRegistrarSalidaInventario = {
    productoId: 'producto-1',
    bodegaId: 'bodega-1',
    cantidad: 10,
    motivo: 'Venta',
  };

  it('lanza StockInsuficienteError y no escribe nada si no hay stock suficiente', async () => {
    const salidaRepository = new SalidaInventarioRepositoryFake();
    const registrarSalida = new RegistrarSalidaInventario(
      salidaRepository,
      new InventarioActualRepositoryFake(5),
    );

    await expect(registrarSalida.ejecutar(datos)).rejects.toThrow(
      StockInsuficienteError,
    );
    expect(salidaRepository.llamadas).toHaveLength(0);
  });

  it('registra la salida y actualiza el stock cuando hay cantidad suficiente', async () => {
    const salidaRepository = new SalidaInventarioRepositoryFake();
    const registrarSalida = new RegistrarSalidaInventario(
      salidaRepository,
      new InventarioActualRepositoryFake(30),
    );

    await registrarSalida.ejecutar(datos);

    expect(salidaRepository.llamadas).toEqual([
      { datos, nuevaCantidadActual: 20 },
    ]);
  });
});
