import { Injectable, Scope } from '@nestjs/common';

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
    const repositorio = this.repositorioOrm();
    const creada = await repositorio.save(repositorio.create(datos));
    return this.toDomain(creada);
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
    return this.toDomain(actualizada as BodegaOrmEntity);
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
