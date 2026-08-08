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

  await repositorioInventario.save(
    repositorioInventario.create({
      productoId,
      bodegaId,
      cantidadActual: nuevaCantidadActual,
    }),
  );
}
