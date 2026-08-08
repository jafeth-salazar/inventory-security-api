import { BodegaOrmEntity } from '../../../modules/inventory/catalogo/infrastructure/persistence/typeorm/entities/bodega.orm-entity';
import { CategoriaOrmEntity } from '../../../modules/inventory/catalogo/infrastructure/persistence/typeorm/entities/categoria.orm-entity';
import { ProductoOrmEntity } from '../../../modules/inventory/catalogo/infrastructure/persistence/typeorm/entities/producto.orm-entity';
import { ProveedorOrmEntity } from '../../../modules/inventory/catalogo/infrastructure/persistence/typeorm/entities/proveedor.orm-entity';
import { EntradaInventarioOrmEntity } from '../../../modules/inventory/movimientos/infrastructure/persistence/typeorm/entities/entrada-inventario.orm-entity';
import { InventarioActualOrmEntity } from '../../../modules/inventory/movimientos/infrastructure/persistence/typeorm/entities/inventario-actual.orm-entity';
import { OrdenCompraOrmEntity } from '../../../modules/inventory/movimientos/infrastructure/persistence/typeorm/entities/orden-compra.orm-entity';
import { SalidaInventarioOrmEntity } from '../../../modules/inventory/movimientos/infrastructure/persistence/typeorm/entities/salida-inventario.orm-entity';

import dataSource from './data-source';

// Datos de ejemplo para desarrollo/demo — no correr en un ambiente real.
// Requiere las mismas credenciales que las migraciones (inv_dba, db_owner)
// porque inserta directo, sin pasar por casos de uso todavía.
async function seed() {
  await dataSource.initialize();

  const categoriaRepo = dataSource.getRepository(CategoriaOrmEntity);
  const bodegaRepo = dataSource.getRepository(BodegaOrmEntity);
  const proveedorRepo = dataSource.getRepository(ProveedorOrmEntity);
  const productoRepo = dataSource.getRepository(ProductoOrmEntity);
  const ordenCompraRepo = dataSource.getRepository(OrdenCompraOrmEntity);
  const entradaRepo = dataSource.getRepository(EntradaInventarioOrmEntity);
  const salidaRepo = dataSource.getRepository(SalidaInventarioOrmEntity);
  const inventarioActualRepo = dataSource.getRepository(
    InventarioActualOrmEntity,
  );

  const [electronica, oficina] = await categoriaRepo.save([
    { nombre: 'Electrónica' },
    { nombre: 'Oficina' },
  ]);

  const [bodegaCentral, bodegaNorte] = await bodegaRepo.save([
    { nombre: 'Bodega Central', ubicacion: 'San José' },
    { nombre: 'Bodega Norte', ubicacion: 'Alajuela' },
  ]);

  const proveedor = await proveedorRepo.save({
    nombre: 'Proveedora XYZ S.A.',
    telefono: '+506 2222-3333',
    correo: 'ventas@proveedoraxyz.example.com',
    direccion: 'Zona Industrial, San José',
  });

  const [mouse, teclado, papel] = await productoRepo.save([
    {
      nombre: 'Mouse inalámbrico',
      descripcion: 'Mouse óptico inalámbrico 2.4GHz',
      precioUnitario: '15.99',
      categoriaId: electronica.id,
      proveedorId: proveedor.id,
    },
    {
      nombre: 'Teclado mecánico',
      descripcion: 'Teclado mecánico switches rojos',
      precioUnitario: '45.50',
      categoriaId: electronica.id,
      proveedorId: proveedor.id,
    },
    {
      nombre: 'Resma de papel',
      descripcion: 'Papel carta 500 hojas',
      precioUnitario: '4.25',
      categoriaId: oficina.id,
      proveedorId: null,
    },
  ]);

  const ordenCompra = await ordenCompraRepo.save({
    proveedorId: proveedor.id,
    total: '500.00',
  });

  await entradaRepo.save([
    {
      productoId: mouse.id,
      bodegaId: bodegaCentral.id,
      ordenCompraId: ordenCompra.id,
      cantidad: 100,
    },
    {
      productoId: teclado.id,
      bodegaId: bodegaCentral.id,
      ordenCompraId: ordenCompra.id,
      cantidad: 50,
    },
    {
      productoId: papel.id,
      bodegaId: bodegaNorte.id,
      ordenCompraId: null,
      cantidad: 200,
    },
  ]);

  await salidaRepo.save({
    productoId: mouse.id,
    bodegaId: bodegaCentral.id,
    cantidad: 5,
    motivo: 'venta',
  });

  await inventarioActualRepo.save([
    { productoId: mouse.id, bodegaId: bodegaCentral.id, cantidadActual: 95 },
    { productoId: teclado.id, bodegaId: bodegaCentral.id, cantidadActual: 50 },
    { productoId: papel.id, bodegaId: bodegaNorte.id, cantidadActual: 200 },
  ]);

  console.log('Seed completado.');
  await dataSource.destroy();
}

seed().catch((error: unknown) => {
  console.error('Seed falló:', error);
  process.exit(1);
});
