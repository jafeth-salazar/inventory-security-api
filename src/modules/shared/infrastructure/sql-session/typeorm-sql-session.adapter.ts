import { randomUUID } from 'node:crypto';

import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import { DataSource } from 'typeorm';

import { CredencialesInvalidasError } from '../../domain/errors/credenciales-invalidas.error';
import { SesionNoEncontradaError } from '../../domain/errors/sesion-no-encontrada.error';
import { SesionSql, SqlSessionPort } from '../../domain/ports/sql-session.port';

import { ORM_ENTITIES } from './orm-entities.registry';

@Injectable()
export class TypeOrmSqlSessionAdapter
  implements SqlSessionPort, OnModuleDestroy
{
  private readonly logger = new Logger(TypeOrmSqlSessionAdapter.name);
  private readonly sesiones = new Map<string, DataSource>();

  async authenticate(usuario: string, password: string): Promise<SesionSql> {
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
      entities: ORM_ENTITIES,
    });

    try {
      await dataSource.initialize();
    } catch {
      this.logger.warn(`Login rechazado por SQL Server para "${usuario}".`);
      throw new CredencialesInvalidasError();
    }

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
