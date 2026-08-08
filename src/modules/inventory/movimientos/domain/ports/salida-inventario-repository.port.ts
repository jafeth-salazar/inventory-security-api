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
   * Valida stock suficiente y actualiza InventarioActual en una sola
   * transacción serializable — lanza StockInsuficienteError si no alcanza.
   */
  registrarConActualizacionDeStock(
    datos: DatosRegistrarSalidaInventario,
  ): Promise<SalidaInventario>;
  listar(): Promise<SalidaInventario[]>;
  obtenerPorId(id: string): Promise<SalidaInventario | null>;
}
