import { Module } from '@nestjs/common';

import { ActualizarBodega } from '../application/use-cases/actualizar-bodega.use-case';
import { ActualizarCategoria } from '../application/use-cases/actualizar-categoria.use-case';
import { ActualizarProducto } from '../application/use-cases/actualizar-producto.use-case';
import { ActualizarProveedor } from '../application/use-cases/actualizar-proveedor.use-case';
import { CrearBodega } from '../application/use-cases/crear-bodega.use-case';
import { CrearCategoria } from '../application/use-cases/crear-categoria.use-case';
import { CrearProducto } from '../application/use-cases/crear-producto.use-case';
import { CrearProveedor } from '../application/use-cases/crear-proveedor.use-case';
import { EliminarBodega } from '../application/use-cases/eliminar-bodega.use-case';
import { EliminarCategoria } from '../application/use-cases/eliminar-categoria.use-case';
import { EliminarProducto } from '../application/use-cases/eliminar-producto.use-case';
import { EliminarProveedor } from '../application/use-cases/eliminar-proveedor.use-case';
import { ListarBodegas } from '../application/use-cases/listar-bodegas.use-case';
import { ListarCategorias } from '../application/use-cases/listar-categorias.use-case';
import { ListarProductos } from '../application/use-cases/listar-productos.use-case';
import { ListarProveedores } from '../application/use-cases/listar-proveedores.use-case';
import { ObtenerBodegaPorId } from '../application/use-cases/obtener-bodega-por-id.use-case';
import { ObtenerCategoriaPorId } from '../application/use-cases/obtener-categoria-por-id.use-case';
import { ObtenerProductoPorId } from '../application/use-cases/obtener-producto-por-id.use-case';
import { ObtenerProveedorPorId } from '../application/use-cases/obtener-proveedor-por-id.use-case';
import { BODEGA_REPOSITORY } from '../domain/ports/bodega-repository.port';
import { CATEGORIA_REPOSITORY } from '../domain/ports/categoria-repository.port';
import { PRODUCTO_REPOSITORY } from '../domain/ports/producto-repository.port';
import { PROVEEDOR_REPOSITORY } from '../domain/ports/proveedor-repository.port';
import { BodegaController } from '../presentation/http/bodega.controller';
import { CategoriaController } from '../presentation/http/categoria.controller';
import { ProductoController } from '../presentation/http/producto.controller';
import { ProveedorController } from '../presentation/http/proveedor.controller';

import { TypeOrmBodegaRepository } from './persistence/typeorm/repositories/typeorm-bodega.repository';
import { TypeOrmCategoriaRepository } from './persistence/typeorm/repositories/typeorm-categoria.repository';
import { TypeOrmProductoRepository } from './persistence/typeorm/repositories/typeorm-producto.repository';
import { TypeOrmProveedorRepository } from './persistence/typeorm/repositories/typeorm-proveedor.repository';

@Module({
  controllers: [
    BodegaController,
    CategoriaController,
    ProveedorController,
    ProductoController,
  ],
  providers: [
    { provide: BODEGA_REPOSITORY, useClass: TypeOrmBodegaRepository },
    { provide: CATEGORIA_REPOSITORY, useClass: TypeOrmCategoriaRepository },
    { provide: PROVEEDOR_REPOSITORY, useClass: TypeOrmProveedorRepository },
    { provide: PRODUCTO_REPOSITORY, useClass: TypeOrmProductoRepository },
    CrearBodega,
    ListarBodegas,
    ObtenerBodegaPorId,
    ActualizarBodega,
    EliminarBodega,
    CrearCategoria,
    ListarCategorias,
    ObtenerCategoriaPorId,
    ActualizarCategoria,
    EliminarCategoria,
    CrearProveedor,
    ListarProveedores,
    ObtenerProveedorPorId,
    ActualizarProveedor,
    EliminarProveedor,
    CrearProducto,
    ListarProductos,
    ObtenerProductoPorId,
    ActualizarProducto,
    EliminarProducto,
  ],
})
export class CatalogoModule {}
