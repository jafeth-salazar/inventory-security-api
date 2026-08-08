import {
  BodegaOrmEntity,
  CategoriaOrmEntity,
  ProductoOrmEntity,
  ProveedorOrmEntity,
} from '../../../inventory/catalogo/infrastructure/persistence/typeorm/entities';
import {
  EntradaInventarioOrmEntity,
  InventarioActualOrmEntity,
  OrdenCompraOrmEntity,
  SalidaInventarioOrmEntity,
} from '../../../inventory/movimientos/infrastructure/persistence/typeorm/entities';

// Toda entidad TypeORM nueva debe agregarse aquí — el DataSource de sesión
// (uno por usuario autenticado) necesita conocerlas todas al abrir la
// conexión, igual que el DataSource del CLI en
// src/infrastructure/persistence/typeorm/data-source.ts.
export const ORM_ENTITIES = [
  BodegaOrmEntity,
  CategoriaOrmEntity,
  ProductoOrmEntity,
  ProveedorOrmEntity,
  EntradaInventarioOrmEntity,
  InventarioActualOrmEntity,
  OrdenCompraOrmEntity,
  SalidaInventarioOrmEntity,
];
