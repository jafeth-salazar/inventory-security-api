import { randomUUID } from 'node:crypto';

import { Injectable, Scope } from '@nestjs/common';

import { EntidadNoEncontradaError } from '../../../../../../shared/domain/errors/entidad-no-encontrada.error';
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
    const id = randomUUID();
    // .insert() en vez de .save(): evita la recarga por SELECT que TypeORM
    // hace tras guardar entidades con relaciones (@ManyToOne a Categoria/
    // Proveedor acá) — esa recarga necesita permiso SELECT en la tabla, que
    // Operador no tiene. No hace falta releer nada porque ya tenemos todos
    // los valores del lado de la app.
    await this.repositorioOrm().insert({ ...datos, id });
    return this.toDomain({ ...datos, id } as ProductoOrmEntity);
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
    if (!actualizado) {
      throw new EntidadNoEncontradaError('Producto', id);
    }
    return this.toDomain(actualizado);
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
