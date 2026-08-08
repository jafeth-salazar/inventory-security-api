import { EntradaInventario } from '../entities/entrada-inventario.entity';

export interface DatosRegistrarEntradaInventario {
  productoId: string;
  bodegaId: string;
  ordenCompraId: string | null;
  cantidad: number;
}

export const ENTRADA_INVENTARIO_REPOSITORY = Symbol(
  'ENTRADA_INVENTARIO_REPOSITORY',
);

export interface EntradaInventarioRepositoryPort {
  /**
   * Inserta la entrada y actualiza InventarioActual en una sola transacción
   * serializable.
   */
  registrarConActualizacionDeStock(
    datos: DatosRegistrarEntradaInventario,
  ): Promise<EntradaInventario>;
  listar(): Promise<EntradaInventario[]>;
  obtenerPorId(id: string): Promise<EntradaInventario | null>;
}
