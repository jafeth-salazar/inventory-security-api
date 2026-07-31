import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  Unique,
} from 'typeorm';

import { BodegaOrmEntity } from './bodega.orm-entity';
import { ProductoOrmEntity } from './producto.orm-entity';

@Entity({ name: 'InventarioActual' })
@Unique('UQ_InventarioActual_producto_bodega', ['productoId', 'bodegaId'])
export class InventarioActualOrmEntity {
  // UUID v4 (NEWID()): ver nota en bodega.orm-entity.ts
  @PrimaryColumn({
    name: 'id',
    type: 'uniqueidentifier',
    default: () => 'NEWID()',
  })
  id: string;

  @Column({ name: 'producto_id', type: 'uniqueidentifier' })
  productoId: string;

  @ManyToOne(() => ProductoOrmEntity)
  @JoinColumn({ name: 'producto_id' })
  producto: ProductoOrmEntity;

  @Column({ name: 'bodega_id', type: 'uniqueidentifier' })
  bodegaId: string;

  @ManyToOne(() => BodegaOrmEntity)
  @JoinColumn({ name: 'bodega_id' })
  bodega: BodegaOrmEntity;

  @Column({ name: 'cantidad_actual', type: 'int', default: 0 })
  cantidadActual: number;
}
