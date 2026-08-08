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
   * Inserta la entrada y actualiza InventarioActual a `nuevaCantidadActual`
   * en una sola transacción de BD.
   */
  registrarConActualizacionDeStock(
    datos: DatosRegistrarEntradaInventario,
    nuevaCantidadActual: number,
  ): Promise<EntradaInventario>;
  listar(): Promise<EntradaInventario[]>;
  obtenerPorId(id: string): Promise<EntradaInventario | null>;
}
