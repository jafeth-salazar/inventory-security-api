import { InventarioActual } from '../entities/inventario-actual.entity';

export const INVENTARIO_ACTUAL_REPOSITORY = Symbol(
  'INVENTARIO_ACTUAL_REPOSITORY',
);

export interface InventarioActualRepositoryPort {
  listar(): Promise<InventarioActual[]>;
  obtenerPorId(id: string): Promise<InventarioActual | null>;
  obtenerPorProductoYBodega(
    productoId: string,
    bodegaId: string,
  ): Promise<InventarioActual | null>;
}
