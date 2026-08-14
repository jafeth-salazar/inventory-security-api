import { randomUUID } from 'node:crypto';

import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import { DataSource } from 'typeorm';

import { CredencialesInvalidasError } from '../../domain/errors/credenciales-invalidas.error';
import { SesionNoEncontradaError } from '../../domain/errors/sesion-no-encontrada.error';
import {
  OrigenConexion,
  SesionSql,
  SqlSessionPort,
} from '../../domain/ports/sql-session.port';

import { ORM_ENTITIES } from './orm-entities.registry';

@Injectable()
export class TypeOrmSqlSessionAdapter
  implements SqlSessionPort, OnModuleDestroy
{
  private readonly logger = new Logger(TypeOrmSqlSessionAdapter.name);
  private readonly sesiones = new Map<string, DataSource>();

  async authenticate(
    usuario: string,
    password: string,
    origen: OrigenConexion,
  ): Promise<SesionSql> {
    const dataSource = new DataSource({
      type: 'mssql',
      host: process.env.DB_HOST ?? 'localhost',
      port: Number(process.env.DB_PORT ?? 1433),
      database: process.env.DB_NAME ?? 'InventorySecurityDB',
      username: usuario,
      password,
      options: {
        encrypt: true,
        trustServerCertificate: true,
      },
      // Una sola conexión física por sesión: SESSION_CONTEXT (ver abajo) vive
      // en la conexión física, no en el DataSource — si el pool tuviera más
      // de una conexión, una query podría caer en una conexión donde nunca
      // se seteó el contexto y los triggers verían IPOrigen/EquipoOrigen null.
      pool: { min: 1, max: 1 },
      entities: ORM_ENTITIES,
    });

    try {
      await dataSource.initialize();
    } catch {
      this.logger.warn(`Login rechazado por SQL Server para "${usuario}".`);
      throw new CredencialesInvalidasError();
    }

    // Deja el origen real del request (no el del contenedor de la API) en la
    // sesión SQL, para que los triggers de auditoría lo lean con
    // SESSION_CONTEXT(). Solo dura mientras viva esta conexión física.
    await dataSource.query(
      'EXEC sp_set_session_context @key = @0, @value = @1',
      ['IPOrigen', origen.ip],
    );
    await dataSource.query(
      'EXEC sp_set_session_context @key = @0, @value = @1',
      ['EquipoOrigen', origen.equipo],
    );

    const sessionId = randomUUID();
    this.sesiones.set(sessionId, dataSource);
    return { sessionId, usuario };
  }

  getDataSource(sessionId: string): DataSource {
    const dataSource = this.sesiones.get(sessionId);
    if (!dataSource) {
      throw new SesionNoEncontradaError();
    }
    return dataSource;
  }

  async closeSession(sessionId: string): Promise<void> {
    const dataSource = this.sesiones.get(sessionId);
    if (!dataSource) {
      return;
    }
    this.sesiones.delete(sessionId);
    await dataSource.destroy();
  }

  async onModuleDestroy(): Promise<void> {
    await Promise.all(
      [...this.sesiones.values()].map((dataSource) => dataSource.destroy()),
    );
    this.sesiones.clear();
  }
}
