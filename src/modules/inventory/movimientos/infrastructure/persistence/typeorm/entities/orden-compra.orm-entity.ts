import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';

import { ProveedorOrmEntity } from '../../../../../catalogo/infrastructure/persistence/typeorm/entities/proveedor.orm-entity';

// total es candidato a enmascaramiento (Parte 2.3, aún pendiente)
@Entity({ name: 'OrdenesCompra' })
export class OrdenCompraOrmEntity {
  // UUID v4 generado por la app: ver nota en bodega.orm-entity.ts
  @PrimaryColumn({ type: 'uniqueidentifier' })
  id: string;

  @Column({ name: 'proveedor_id', type: 'uniqueidentifier' })
  proveedorId: string;

  @ManyToOne(() => ProveedorOrmEntity)
  @JoinColumn({ name: 'proveedor_id' })
  proveedor: ProveedorOrmEntity;

  // Columna plana (no @CreateDateColumn): la app manda `new Date()` explícito
  // al crear — ver typeorm-orden-compra.repository.ts. Si TypeORM tuviera que
  // releer esta columna generada por la BD (getdate()) después del INSERT,
  // necesitaría SELECT sobre esta tabla, permiso que Operador no tiene.
  @Column({ name: 'fecha', type: 'datetime2' })
  fecha: Date;

  @Column({ name: 'total', type: 'decimal', precision: 12, scale: 2 })
  total: string;
}
