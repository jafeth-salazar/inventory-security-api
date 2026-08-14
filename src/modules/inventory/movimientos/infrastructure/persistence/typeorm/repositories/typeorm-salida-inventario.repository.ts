import { randomUUID } from 'node:crypto';

import { Injectable, Scope } from '@nestjs/common';

import { CurrentSqlSession } from '../../../../../../shared/infrastructure/sql-session/current-sql-session';
import { SalidaInventario } from '../../../../domain/entities/salida-inventario.entity';
import { StockInsuficienteError } from '../../../../domain/errors/stock-insuficiente.error';
import {
  DatosRegistrarSalidaInventario,
  SalidaInventarioRepositoryPort,
} from '../../../../domain/ports/salida-inventario-repository.port';
import { InventarioActualOrmEntity } from '../entities/inventario-actual.orm-entity';
import { SalidaInventarioOrmEntity } from '../entities/salida-inventario.orm-entity';
import { upsertInventarioActual } from '../upsert-inventario-actual';

@Injectable({ scope: Scope.REQUEST })
export class TypeOrmSalidaInventarioRepository implements SalidaInventarioRepositoryPort {
  constructor(private readonly currentSqlSession: CurrentSqlSession) {}

  async registrarConActualizacionDeStock(
    datos: DatosRegistrarSalidaInventario,
  ): Promise<SalidaInventario> {
    const dataSource = this.currentSqlSession.getDataSource();

    const salidaCreada = await dataSource.transaction(
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

        if (cantidadActual < datos.cantidad) {
          throw new StockInsuficienteError(
            datos.productoId,
            datos.bodegaId,
            datos.cantidad,
            cantidadActual,
          );
        }

        const id = randomUUID();
        const fecha = new Date();
        // .insert() en vez de .save(): evita la recarga por SELECT que
        // TypeORM hace tras guardar entidades con relaciones (@ManyToOne a
        // Producto/Bodega acá) — esa recarga necesita permiso SELECT en la
        // tabla, que Operador no tiene.
        await manager
          .getRepository(SalidaInventarioOrmEntity)
          .insert({ ...datos, id, fecha });

        await upsertInventarioActual(
          manager,
          datos.productoId,
          datos.bodegaId,
          cantidadActual - datos.cantidad,
          existente,
        );

        return { ...datos, id, fecha } as SalidaInventarioOrmEntity;
      },
    );

    return this.toDomain(salidaCreada);
  }

  async listar(): Promise<SalidaInventario[]> {
    const filas = await this.repositorioOrm().find();
    return filas.map((fila) => this.toDomain(fila));
  }

  async obtenerPorId(id: string): Promise<SalidaInventario | null> {
    const fila = await this.repositorioOrm().findOneBy({ id });
    return fila ? this.toDomain(fila) : null;
  }

  private repositorioOrm() {
    return this.currentSqlSession
      .getDataSource()
      .getRepository(SalidaInventarioOrmEntity);
  }

  private toDomain(fila: SalidaInventarioOrmEntity): SalidaInventario {
    return new SalidaInventario(
      fila.id,
      fila.productoId,
      fila.bodegaId,
      fila.cantidad,
      fila.motivo,
      fila.fecha,
    );
  }
}
