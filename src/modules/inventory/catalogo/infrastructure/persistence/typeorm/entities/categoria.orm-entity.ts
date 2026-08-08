import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'Categorias' })
export class CategoriaOrmEntity {
  // UUID v4 (NEWID()): ver nota en bodega.orm-entity.ts
  @PrimaryColumn({
    name: 'id',
    type: 'uniqueidentifier',
    default: () => 'NEWID()',
  })
  id: string;

  @Column({ name: 'nombre', type: 'nvarchar', length: 100 })
  nombre: string;
}
