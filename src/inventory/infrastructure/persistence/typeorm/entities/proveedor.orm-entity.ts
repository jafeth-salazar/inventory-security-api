import { Column, Entity, PrimaryColumn } from 'typeorm';

// nombre/telefono/correo son candidatos a enmascaramiento (Parte 2.3, aún pendiente)
@Entity({ name: 'Proveedores' })
export class ProveedorOrmEntity {
  // UUID v4 (NEWID()): ver nota en bodega.orm-entity.ts
  @PrimaryColumn({
    name: 'id',
    type: 'uniqueidentifier',
    default: () => 'NEWID()',
  })
  id: string;

  @Column({ name: 'nombre', type: 'nvarchar', length: 150 })
  nombre: string;

  @Column({ name: 'telefono', type: 'nvarchar', length: 50, nullable: true })
  telefono: string | null;

  @Column({ name: 'correo', type: 'nvarchar', length: 150, nullable: true })
  correo: string | null;

  @Column({ name: 'direccion', type: 'nvarchar', length: 200, nullable: true })
  direccion: string | null;
}
