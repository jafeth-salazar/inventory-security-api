import { randomUUID } from 'node:crypto';

import { Injectable, Scope } from '@nestjs/common';

import { EntidadNoEncontradaError } from '../../../../../../shared/domain/errors/entidad-no-encontrada.error';
import { CurrentSqlSession } from '../../../../../../shared/infrastructure/sql-session/current-sql-session';
import { Proveedor } from '../../../../domain/entities/proveedor.entity';
import {
  DatosActualizarProveedor,
  DatosCrearProveedor,
  ProveedorRepositoryPort,
} from '../../../../domain/ports/proveedor-repository.port';
import { ProveedorOrmEntity } from '../entities/proveedor.orm-entity';

@Injectable({ scope: Scope.REQUEST })
export class TypeOrmProveedorRepository implements ProveedorRepositoryPort {
  constructor(private readonly currentSqlSession: CurrentSqlSession) {}

  async crear(datos: DatosCrearProveedor): Promise<Proveedor> {
    const id = randomUUID();
    // .insert() en vez de .save(): evita la recarga por SELECT que TypeORM
    // hace tras guardar una entidad (necesita permiso SELECT en la tabla,
    // que Operador no tiene). No hace falta releer nada porque ya tenemos
    // todos los valores del lado de la app.
    await this.repositorioOrm().insert({ ...datos, id });
    return this.toDomain({ ...datos, id });
  }

  async listar(): Promise<Proveedor[]> {
    const filas = await this.repositorioOrm().find();
    return filas.map((fila) => this.toDomain(fila));
  }

  async obtenerPorId(id: string): Promise<Proveedor | null> {
    const fila = await this.repositorioOrm().findOneBy({ id });
    return fila ? this.toDomain(fila) : null;
  }

  async actualizar(
    id: string,
    cambios: DatosActualizarProveedor,
  ): Promise<Proveedor> {
    const repositorio = this.repositorioOrm();
    await repositorio.update({ id }, cambios);
    const actualizado = await repositorio.findOneBy({ id });
    if (!actualizado) {
      throw new EntidadNoEncontradaError('Proveedor', id);
    }
    return this.toDomain(actualizado);
  }

  async eliminar(id: string): Promise<void> {
    await this.repositorioOrm().delete({ id });
  }

  private repositorioOrm() {
    return this.currentSqlSession
      .getDataSource()
      .getRepository(ProveedorOrmEntity);
  }

  private toDomain(fila: ProveedorOrmEntity): Proveedor {
    return new Proveedor(
      fila.id,
      fila.nombre,
      fila.telefono,
      fila.correo,
      fila.direccion,
    );
  }
}
