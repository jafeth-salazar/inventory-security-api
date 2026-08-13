import { randomUUID } from 'node:crypto';

import { Injectable, Scope } from '@nestjs/common';

import { EntidadNoEncontradaError } from '../../../../../../shared/domain/errors/entidad-no-encontrada.error';
import { CurrentSqlSession } from '../../../../../../shared/infrastructure/sql-session/current-sql-session';
import { Categoria } from '../../../../domain/entities/categoria.entity';
import {
  CategoriaRepositoryPort,
  DatosActualizarCategoria,
  DatosCrearCategoria,
} from '../../../../domain/ports/categoria-repository.port';
import { CategoriaOrmEntity } from '../entities/categoria.orm-entity';

@Injectable({ scope: Scope.REQUEST })
export class TypeOrmCategoriaRepository implements CategoriaRepositoryPort {
  constructor(private readonly currentSqlSession: CurrentSqlSession) {}

  async crear(datos: DatosCrearCategoria): Promise<Categoria> {
    const id = randomUUID();
    // .insert() en vez de .save(): evita la recarga por SELECT que TypeORM
    // hace tras guardar una entidad (necesita permiso SELECT en la tabla,
    // que Operador no tiene). No hace falta releer nada porque ya tenemos
    // todos los valores del lado de la app.
    await this.repositorioOrm().insert({ ...datos, id });
    return this.toDomain({ ...datos, id });
  }

  async listar(): Promise<Categoria[]> {
    const filas = await this.repositorioOrm().find();
    return filas.map((fila) => this.toDomain(fila));
  }

  async obtenerPorId(id: string): Promise<Categoria | null> {
    const fila = await this.repositorioOrm().findOneBy({ id });
    return fila ? this.toDomain(fila) : null;
  }

  async actualizar(
    id: string,
    cambios: DatosActualizarCategoria,
  ): Promise<Categoria> {
    const repositorio = this.repositorioOrm();
    await repositorio.update({ id }, cambios);
    const actualizada = await repositorio.findOneBy({ id });
    if (!actualizada) {
      throw new EntidadNoEncontradaError('Categoria', id);
    }
    return this.toDomain(actualizada);
  }

  async eliminar(id: string): Promise<void> {
    await this.repositorioOrm().delete({ id });
  }

  private repositorioOrm() {
    return this.currentSqlSession
      .getDataSource()
      .getRepository(CategoriaOrmEntity);
  }

  private toDomain(fila: CategoriaOrmEntity): Categoria {
    return new Categoria(fila.id, fila.nombre);
  }
}
