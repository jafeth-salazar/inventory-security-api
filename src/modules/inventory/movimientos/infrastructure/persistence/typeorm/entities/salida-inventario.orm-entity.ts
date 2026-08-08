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

@Entity({ name: 'SalidasInventario' })
export class SalidaInventarioOrmEntity {
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

  @Column({ name: 'cantidad', type: 'int' })
  cantidad: number;

  @Column({ name: 'motivo', type: 'nvarchar', length: 100, nullable: true })
  motivo: string | null;

  @CreateDateColumn({ name: 'fecha', type: 'datetime2' })
  fecha: Date;
}
