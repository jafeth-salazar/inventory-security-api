import { randomUUID } from 'node:crypto';

import { Injectable, Scope } from '@nestjs/common';

import { CurrentSqlSession } from '../../../../../../shared/infrastructure/sql-session/current-sql-session';
import { EntradaInventario } from '../../../../domain/entities/entrada-inventario.entity';
import {
  DatosRegistrarEntradaInventario,
  EntradaInventarioRepositoryPort,
} from '../../../../domain/ports/entrada-inventario-repository.port';
import { EntradaInventarioOrmEntity } from '../entities/entrada-inventario.orm-entity';
import { InventarioActualOrmEntity } from '../entities/inventario-actual.orm-entity';
import { upsertInventarioActual } from '../upsert-inventario-actual';

@Injectable({ scope: Scope.REQUEST })
export class TypeOrmEntradaInventarioRepository implements EntradaInventarioRepositoryPort {
  constructor(private readonly currentSqlSession: CurrentSqlSession) {}

  async registrarConActualizacionDeStock(
    datos: DatosRegistrarEntradaInventario,
  ): Promise<EntradaInventario> {
    const dataSource = this.currentSqlSession.getDataSource();

    const entradaCreada = await dataSource.transaction(
      'SERIALIZABLE',
      async (manager) => {
        const repositorioInventario = manager.getRepository(
          InventarioActualOrmEntity,
        );
        const existente = await repositorioInventario.findOneBy({
          productoId: datos.productoId,
          bodegaId: datos.bodegaId,
        });
        const cantidadActual = existente?.cantidadActual ?? 0;

        const id = randomUUID();
        const fecha = new Date();
        // .insert() en vez de .save(): evita la recarga por SELECT que
        // TypeORM hace tras guardar entidades con relaciones (@ManyToOne a
        // Producto/Bodega/OrdenCompra acá) — esa recarga necesita permiso
        // SELECT en la tabla, que Operador no tiene.
        await manager
          .getRepository(EntradaInventarioOrmEntity)
          .insert({ ...datos, id, fecha });

        await upsertInventarioActual(
          manager,
          datos.productoId,
          datos.bodegaId,
          cantidadActual + datos.cantidad,
          existente,
        );

        return { ...datos, id, fecha } as EntradaInventarioOrmEntity;
      },
    );

    return this.toDomain(entradaCreada);
  }

  async listar(): Promise<EntradaInventario[]> {
    const filas = await this.repositorioOrm().find();
    return filas.map((fila) => this.toDomain(fila));
  }

  async obtenerPorId(id: string): Promise<EntradaInventario | null> {
    const fila = await this.repositorioOrm().findOneBy({ id });
    return fila ? this.toDomain(fila) : null;
  }

  private repositorioOrm() {
    return this.currentSqlSession
      .getDataSource()
      .getRepository(EntradaInventarioOrmEntity);
  }

  private toDomain(fila: EntradaInventarioOrmEntity): EntradaInventario {
    return new EntradaInventario(
      fila.id,
      fila.productoId,
      fila.bodegaId,
      fila.ordenCompraId,
      fila.cantidad,
      fila.fecha,
    );
  }
}
