import { Injectable, Scope } from '@nestjs/common';

import { CurrentSqlSession } from '../../../../../../shared/infrastructure/sql-session/current-sql-session';
import { Producto } from '../../../../domain/entities/producto.entity';
import {
  DatosActualizarProducto,
  DatosCrearProducto,
  ProductoRepositoryPort,
} from '../../../../domain/ports/producto-repository.port';
import { ProductoOrmEntity } from '../entities/producto.orm-entity';

@Injectable({ scope: Scope.REQUEST })
export class TypeOrmProductoRepository implements ProductoRepositoryPort {
  constructor(private readonly currentSqlSession: CurrentSqlSession) {}

  async crear(datos: DatosCrearProducto): Promise<Producto> {
    const repositorio = this.repositorioOrm();
    const creado = await repositorio.save(repositorio.create(datos));
    return this.toDomain(creado);
  }

  async listar(): Promise<Producto[]> {
    const filas = await this.repositorioOrm().find();
    return filas.map((fila) => this.toDomain(fila));
  }

  async obtenerPorId(id: string): Promise<Producto | null> {
    const fila = await this.repositorioOrm().findOneBy({ id });
    return fila ? this.toDomain(fila) : null;
  }

  async actualizar(
    id: string,
    cambios: DatosActualizarProducto,
  ): Promise<Producto> {
    const repositorio = this.repositorioOrm();
    await repositorio.update({ id }, cambios);
    const actualizado = await repositorio.findOneBy({ id });
    return this.toDomain(actualizado as ProductoOrmEntity);
  }

  async eliminar(id: string): Promise<void> {
    await this.repositorioOrm().delete({ id });
  }

  private repositorioOrm() {
    return this.currentSqlSession
      .getDataSource()
      .getRepository(ProductoOrmEntity);
  }

  private toDomain(fila: ProductoOrmEntity): Producto {
    return new Producto(
      fila.id,
      fila.nombre,
      fila.descripcion,
      fila.precioUnitario,
      fila.categoriaId,
      fila.proveedorId,
    );
  }
}
