import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'Bodegas' })
export class BodegaOrmEntity {
  // UUID v4 (NEWID()): aleatorio real, no secuencial — evita enumeration
  // attacks (a diferencia de NEWSEQUENTIALID() o un INT IDENTITY).
  @PrimaryColumn({
    name: 'id',
    type: 'uniqueidentifier',
    default: () => 'NEWID()',
  })
  id: string;

  @Column({ name: 'nombre', type: 'nvarchar', length: 100 })
  nombre: string;

  @Column({ name: 'ubicacion', type: 'nvarchar', length: 200, nullable: true })
  ubicacion: string | null;
}
