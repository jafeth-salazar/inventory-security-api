import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'Categorias' })
export class CategoriaOrmEntity {
  // UUID v4 generado por la app: ver nota en bodega.orm-entity.ts
  @PrimaryColumn({ type: 'uniqueidentifier' })
  id: string;

  @Column({ name: 'nombre', type: 'nvarchar', length: 100 })
  nombre: string;
}
