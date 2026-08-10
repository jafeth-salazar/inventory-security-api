import { randomUUID } from 'node:crypto';

import { EntityManager } from 'typeorm';

import { InventarioActualOrmEntity } from './entities/inventario-actual.orm-entity';

export async function upsertInventarioActual(
  manager: EntityManager,
  productoId: string,
  bodegaId: string,
  nuevaCantidadActual: number,
  existente?: InventarioActualOrmEntity | null,
): Promise<void> {
  const repositorioInventario = manager.getRepository(
    InventarioActualOrmEntity,
  );
  const fila =
    existente === undefined
      ? await repositorioInventario.findOneBy({ productoId, bodegaId })
      : existente;

  if (fila) {
    await repositorioInventario.update(
      { id: fila.id },
      { cantidadActual: nuevaCantidadActual },
    );
    return;
  }

  // .insert() en vez de .save(): evita la recarga por SELECT que TypeORM
  // hace tras guardar entidades con relaciones (@ManyToOne a Producto/Bodega
  // acá) — esa recarga necesita permiso SELECT en la tabla, que Operador no
  // tiene.
  await repositorioInventario.insert({
    id: randomUUID(),
    productoId,
    bodegaId,
    cantidadActual: nuevaCantidadActual,
  });
}
