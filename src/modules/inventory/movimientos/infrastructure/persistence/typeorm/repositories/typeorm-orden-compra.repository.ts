import { Injectable, Scope } from '@nestjs/common';

import { CurrentSqlSession } from '../../../../../../shared/infrastructure/sql-session/current-sql-session';
import { OrdenCompra } from '../../../../domain/entities/orden-compra.entity';
import {
  DatosRegistrarOrdenCompra,
  OrdenCompraRepositoryPort,
} from '../../../../domain/ports/orden-compra-repository.port';
import { OrdenCompraOrmEntity } from '../entities/orden-compra.orm-entity';

@Injectable({ scope: Scope.REQUEST })
export class TypeOrmOrdenCompraRepository implements OrdenCompraRepositoryPort {
  constructor(private readonly currentSqlSession: CurrentSqlSession) {}

  async registrar(datos: DatosRegistrarOrdenCompra): Promise<OrdenCompra> {
    const repositorio = this.repositorioOrm();
    const creada = await repositorio.save(repositorio.create(datos));
    return this.toDomain(creada);
  }

  async listar(): Promise<OrdenCompra[]> {
    const filas = await this.repositorioOrm().find();
    return filas.map((fila) => this.toDomain(fila));
  }

  async obtenerPorId(id: string): Promise<OrdenCompra | null> {
    const fila = await this.repositorioOrm().findOneBy({ id });
    return fila ? this.toDomain(fila) : null;
  }

  private repositorioOrm() {
    return this.currentSqlSession
      .getDataSource()
      .getRepository(OrdenCompraOrmEntity);
  }

  private toDomain(fila: OrdenCompraOrmEntity): OrdenCompra {
    return new OrdenCompra(fila.id, fila.proveedorId, fila.fecha, fila.total);
  }
}
