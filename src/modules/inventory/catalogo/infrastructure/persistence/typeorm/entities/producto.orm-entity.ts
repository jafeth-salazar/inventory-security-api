import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';

import { CategoriaOrmEntity } from './categoria.orm-entity';
import { ProveedorOrmEntity } from './proveedor.orm-entity';

// precio_unitario es candidato a enmascaramiento (Parte 2.3, aún pendiente)
@Entity({ name: 'Productos' })
export class ProductoOrmEntity {
  // UUID v4 (NEWID()): ver nota en bodega.orm-entity.ts
  @PrimaryColumn({
    name: 'id',
    type: 'uniqueidentifier',
    default: () => 'NEWID()',
  })
  id: string;

  @Column({ name: 'nombre', type: 'nvarchar', length: 150 })
  nombre: string;

  @Column({
    name: 'descripcion',
    type: 'nvarchar',
    length: 500,
    nullable: true,
  })
  descripcion: string | null;

  @Column({ name: 'precio_unitario', type: 'decimal', precision: 12, scale: 2 })
  precioUnitario: string;

  @Column({ name: 'categoria_id', type: 'uniqueidentifier' })
  categoriaId: string;

  @ManyToOne(() => CategoriaOrmEntity)
  @JoinColumn({ name: 'categoria_id' })
  categoria: CategoriaOrmEntity;

  @Column({ name: 'proveedor_id', type: 'uniqueidentifier', nullable: true })
  proveedorId: string | null;

  @ManyToOne(() => ProveedorOrmEntity, { nullable: true })
  @JoinColumn({ name: 'proveedor_id' })
  proveedor: ProveedorOrmEntity | null;
}
