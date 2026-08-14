import { randomUUID } from 'node:crypto';

import { Injectable, Scope } from '@nestjs/common';

import { EntidadNoEncontradaError } from '../../../../../../shared/domain/errors/entidad-no-encontrada.error';
import { CurrentSqlSession } from '../../../../../../shared/infrastructure/sql-session/current-sql-session';
import { Bodega } from '../../../../domain/entities/bodega.entity';
import {
  BodegaRepositoryPort,
  DatosActualizarBodega,
  DatosCrearBodega,
} from '../../../../domain/ports/bodega-repository.port';
import { BodegaOrmEntity } from '../entities/bodega.orm-entity';

@Injectable({ scope: Scope.REQUEST })
export class TypeOrmBodegaRepository implements BodegaRepositoryPort {
  constructor(private readonly currentSqlSession: CurrentSqlSession) {}

  async crear(datos: DatosCrearBodega): Promise<Bodega> {
    const id = randomUUID();
    // .insert() en vez de .save(): no dispara la recarga por SELECT que
    // TypeORM hace tras guardar entidades con relaciones — acá no aplica
    // (Bodega no tiene @ManyToOne), pero se mantiene el mismo patrón que el
    // resto de repos para que todos se comporten igual sin ese SELECT extra.
    await this.repositorioOrm().insert({ ...datos, id });
    return this.toDomain({ ...datos, id });
  }

  async listar(): Promise<Bodega[]> {
    const filas = await this.repositorioOrm().find();
    return filas.map((fila) => this.toDomain(fila));
  }

  async obtenerPorId(id: string): Promise<Bodega | null> {
    const fila = await this.repositorioOrm().findOneBy({ id });
    return fila ? this.toDomain(fila) : null;
  }

  async actualizar(
    id: string,
    cambios: DatosActualizarBodega,
  ): Promise<Bodega> {
    const repositorio = this.repositorioOrm();
    await repositorio.update({ id }, cambios);
    const actualizada = await repositorio.findOneBy({ id });
    if (!actualizada) {
      throw new EntidadNoEncontradaError('Bodega', id);
    }
    return this.toDomain(actualizada);
  }

  async eliminar(id: string): Promise<void> {
    await this.repositorioOrm().delete({ id });
  }

  private repositorioOrm() {
    return this.currentSqlSession
      .getDataSource()
      .getRepository(BodegaOrmEntity);
  }

  private toDomain(fila: BodegaOrmEntity): Bodega {
    return new Bodega(fila.id, fila.nombre, fila.ubicacion);
  }
}
