export class StockInsuficienteError extends Error {
  constructor(
    productoId: string,
    bodegaId: string,
    cantidadSolicitada: number,
    cantidadDisponible: number,
  ) {
    super(
      `Stock insuficiente para el producto "${productoId}" en la bodega "${bodegaId}": ` +
        `se solicitaron ${cantidadSolicitada} unidades y hay ${cantidadDisponible} disponibles.`,
    );
    this.name = 'StockInsuficienteError';
  }
}
