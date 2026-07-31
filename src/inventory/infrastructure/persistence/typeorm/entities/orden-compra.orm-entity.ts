import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';

import { ProveedorOrmEntity } from './proveedor.orm-entity';

// total es candidato a enmascaramiento (Parte 2.3, aún pendiente)
@Entity({ name: 'OrdenesCompra' })
export class OrdenCompraOrmEntity {
  // UUID v4 (NEWID()): ver nota en bodega.orm-entity.ts
  @PrimaryColumn({
    name: 'id',
    type: 'uniqueidentifier',
    default: () => 'NEWID()',
  })
  id: string;

  @Column({ name: 'proveedor_id', type: 'uniqueidentifier' })
  proveedorId: string;

  @ManyToOne(() => ProveedorOrmEntity)
  @JoinColumn({ name: 'proveedor_id' })
  proveedor: ProveedorOrmEntity;

  @CreateDateColumn({ name: 'fecha', type: 'datetime2' })
  fecha: Date;

  @Column({ name: 'total', type: 'decimal', precision: 12, scale: 2 })
  total: string;
}
