import { Injectable, Scope } from '@nestjs/common';

import { CurrentSqlSession } from '../../../../../../shared/infrastructure/sql-session/current-sql-session';
import { InventarioActual } from '../../../../domain/entities/inventario-actual.entity';
import { InventarioActualRepositoryPort } from '../../../../domain/ports/inventario-actual-repository.port';
import { InventarioActualOrmEntity } from '../entities/inventario-actual.orm-entity';

@Injectable({ scope: Scope.REQUEST })
export class TypeOrmInventarioActualRepository implements InventarioActualRepositoryPort {
  constructor(private readonly currentSqlSession: CurrentSqlSession) {}

  async listar(): Promise<InventarioActual[]> {
    const filas = await this.repositorioOrm().find();
    return filas.map((fila) => this.toDomain(fila));
  }

  async obtenerPorId(id: string): Promise<InventarioActual | null> {
    const fila = await this.repositorioOrm().findOneBy({ id });
    return fila ? this.toDomain(fila) : null;
  }

  async obtenerPorProductoYBodega(
    productoId: string,
    bodegaId: string,
  ): Promise<InventarioActual | null> {
    const fila = await this.repositorioOrm().findOneBy({
      productoId,
      bodegaId,
    });
    return fila ? this.toDomain(fila) : null;
  }

  private repositorioOrm() {
    return this.currentSqlSession
      .getDataSource()
      .getRepository(InventarioActualOrmEntity);
  }

  private toDomain(fila: InventarioActualOrmEntity): InventarioActual {
    return new InventarioActual(
      fila.id,
      fila.productoId,
      fila.bodegaId,
      fila.cantidadActual,
    );
  }
}
