import { randomUUID } from 'node:crypto';

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
    const id = randomUUID();
    const fecha = new Date();
    // .insert() en vez de .save(): evita la recarga por SELECT que TypeORM
    // hace tras guardar entidades con relaciones (@ManyToOne a Proveedor
    // acá) — esa recarga necesita permiso SELECT en la tabla. No hace falta
    // releer nada porque ya tenemos todos los valores del lado de la app.
    await this.repositorioOrm().insert({ ...datos, id, fecha });
    return this.toDomain({ ...datos, id, fecha } as OrdenCompraOrmEntity);
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
