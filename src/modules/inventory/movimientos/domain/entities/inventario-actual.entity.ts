export class InventarioActual {
  constructor(
    public readonly id: string,
    public readonly productoId: string,
    public readonly bodegaId: string,
    public readonly cantidadActual: number,
  ) {}
}
