import { SalidaInventario } from '../entities/salida-inventario.entity';

export interface DatosRegistrarSalidaInventario {
  productoId: string;
  bodegaId: string;
  cantidad: number;
  motivo: string | null;
}

export const SALIDA_INVENTARIO_REPOSITORY = Symbol(
  'SALIDA_INVENTARIO_REPOSITORY',
);

export interface SalidaInventarioRepositoryPort {
  /**
   * Inserta la salida y actualiza InventarioActual a `nuevaCantidadActual`
   * en una sola transacción de BD. El llamador ya validó que hay stock
   * suficiente antes de invocar este método.
   */
  registrarConActualizacionDeStock(
    datos: DatosRegistrarSalidaInventario,
    nuevaCantidadActual: number,
  ): Promise<SalidaInventario>;
  listar(): Promise<SalidaInventario[]>;
  obtenerPorId(id: string): Promise<SalidaInventario | null>;
}
