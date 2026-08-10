import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'Bodegas' })
export class BodegaOrmEntity {
  // UUID v4 generado por la app (randomUUID() en el repositorio, no
  // default: () => 'NEWID()' de la BD): aleatorio real, evita enumeration
  // attacks igual que NEWID(). No delegamos la generación a SQL Server
  // porque el driver mssql de TypeORM (isUUIDGenerationSupported() = true)
  // nunca genera el uuid en Node cuando el default es de la BD — siempre
  // necesitaría releerlo con OUTPUT INSERTED.id, y eso exige permiso SELECT
  // sobre la tabla en cuanto tiene un trigger habilitado (ver migración de
  // auditoría), permiso que el operador (solo escritura) no tiene.
  @PrimaryColumn({ type: 'uniqueidentifier' })
  id: string;

  @Column({ name: 'nombre', type: 'nvarchar', length: 100 })
  nombre: string;

  @Column({ name: 'ubicacion', type: 'nvarchar', length: 200, nullable: true })
  ubicacion: string | null;
}
