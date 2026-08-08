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

        const repositorioEntradas = manager.getRepository(
          EntradaInventarioOrmEntity,
        );
        const entrada = await repositorioEntradas.save(
          repositorioEntradas.create(datos),
        );

        await upsertInventarioActual(
          manager,
          datos.productoId,
          datos.bodegaId,
          cantidadActual + datos.cantidad,
          existente,
        );

        return entrada;
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
