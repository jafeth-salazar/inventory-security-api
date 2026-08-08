import { Injectable, Scope } from '@nestjs/common';

import { CurrentSqlSession } from '../../../../../../shared/infrastructure/sql-session/current-sql-session';
import { SalidaInventario } from '../../../../domain/entities/salida-inventario.entity';
import {
  DatosRegistrarSalidaInventario,
  SalidaInventarioRepositoryPort,
} from '../../../../domain/ports/salida-inventario-repository.port';
import { SalidaInventarioOrmEntity } from '../entities/salida-inventario.orm-entity';
import { upsertInventarioActual } from '../upsert-inventario-actual';

@Injectable({ scope: Scope.REQUEST })
export class TypeOrmSalidaInventarioRepository implements SalidaInventarioRepositoryPort {
  constructor(private readonly currentSqlSession: CurrentSqlSession) {}

  async registrarConActualizacionDeStock(
    datos: DatosRegistrarSalidaInventario,
    nuevaCantidadActual: number,
  ): Promise<SalidaInventario> {
    const dataSource = this.currentSqlSession.getDataSource();

    const salidaCreada = await dataSource.transaction(async (manager) => {
      const repositorioSalidas = manager.getRepository(
        SalidaInventarioOrmEntity,
      );
      const salida = await repositorioSalidas.save(
        repositorioSalidas.create(datos),
      );

      await upsertInventarioActual(
        manager,
        datos.productoId,
        datos.bodegaId,
        nuevaCantidadActual,
      );

      return salida;
    });

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
