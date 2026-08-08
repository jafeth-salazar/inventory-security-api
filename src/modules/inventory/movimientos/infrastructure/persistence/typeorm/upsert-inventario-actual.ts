import { EntityManager } from 'typeorm';

import { InventarioActualOrmEntity } from './entities/inventario-actual.orm-entity';

export async function upsertInventarioActual(
  manager: EntityManager,
  productoId: string,
  bodegaId: string,
  nuevaCantidadActual: number,
): Promise<void> {
  const repositorioInventario = manager.getRepository(
    InventarioActualOrmEntity,
  );
  const existente = await repositorioInventario.findOneBy({
    productoId,
    bodegaId,
  });

  if (existente) {
    await repositorioInventario.update(
      { id: existente.id },
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
