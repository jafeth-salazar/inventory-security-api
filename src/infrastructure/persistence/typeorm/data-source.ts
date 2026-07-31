import { config } from 'dotenv';
import { DataSource } from 'typeorm';

import {
  BodegaOrmEntity,
  CategoriaOrmEntity,
  EntradaInventarioOrmEntity,
  InventarioActualOrmEntity,
  OrdenCompraOrmEntity,
  ProductoOrmEntity,
  ProveedorOrmEntity,
  SalidaInventarioOrmEntity,
} from '../../../inventory/infrastructure/persistence/typeorm/entities';

config();

// DataSource exclusivo del CLI de TypeORM (migraciones/seeds). Usa
// DB_MIGRATION_USER (inv_dba, db_owner) porque crear/alterar tablas requiere
// permisos de DDL que inventory_app (perfil auditor, solo lectura) no tiene.
// La app en runtime NO usa este archivo — ver CLAUDE.md, "Sesión SQL dinámica".
export default new DataSource({
  type: 'mssql',
  host: process.env.DB_HOST ?? 'localhost',
  port: Number(process.env.DB_PORT ?? 1433),
  database: process.env.DB_NAME ?? 'InventorySecurityDB',
  username: process.env.DB_MIGRATION_USER ?? 'inv_dba',
  password: process.env.DB_MIGRATION_PASSWORD,
  options: {
    encrypt: true,
    trustServerCertificate: true,
  },
  entities: [
    BodegaOrmEntity,
    CategoriaOrmEntity,
    ProveedorOrmEntity,
    ProductoOrmEntity,
    OrdenCompraOrmEntity,
    EntradaInventarioOrmEntity,
    SalidaInventarioOrmEntity,
    InventarioActualOrmEntity,
  ],
  migrations: ['src/infrastructure/persistence/typeorm/migrations/*.ts'],
  synchronize: false,
});
