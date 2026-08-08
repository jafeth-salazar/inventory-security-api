import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';

import { BodegaOrmEntity } from '../../../../../catalogo/infrastructure/persistence/typeorm/entities/bodega.orm-entity';
import { ProductoOrmEntity } from '../../../../../catalogo/infrastructure/persistence/typeorm/entities/producto.orm-entity';

import { OrdenCompraOrmEntity } from './orden-compra.orm-entity';

@Entity({ name: 'EntradasInventario' })
export class EntradaInventarioOrmEntity {
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

  @Column({ name: 'orden_compra_id', type: 'uniqueidentifier', nullable: true })
  ordenCompraId: string | null;

  @ManyToOne(() => OrdenCompraOrmEntity, { nullable: true })
  @JoinColumn({ name: 'orden_compra_id' })
  ordenCompra: OrdenCompraOrmEntity | null;

  @Column({ name: 'cantidad', type: 'int' })
  cantidad: number;

  @CreateDateColumn({ name: 'fecha', type: 'datetime2' })
  fecha: Date;
}
