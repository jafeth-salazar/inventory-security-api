import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';

import { BodegaOrmEntity } from '../../../../../catalogo/infrastructure/persistence/typeorm/entities/bodega.orm-entity';
import { ProductoOrmEntity } from '../../../../../catalogo/infrastructure/persistence/typeorm/entities/producto.orm-entity';

@Entity({ name: 'SalidasInventario' })
export class SalidaInventarioOrmEntity {
  // UUID v4 generado por la app: ver nota en bodega.orm-entity.ts
  @PrimaryColumn({ type: 'uniqueidentifier' })
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

  // Columna plana (no @CreateDateColumn): la app manda `new Date()` explícito
  // al crear — ver typeorm-salida-inventario.repository.ts. Si TypeORM
  // tuviera que releer esta columna generada por la BD (getdate()) después
  // del INSERT, necesitaría SELECT sobre esta tabla, permiso que Operador
  // no tiene (solo escritura).
  @Column({ name: 'fecha', type: 'datetime2' })
  fecha: Date;
}
