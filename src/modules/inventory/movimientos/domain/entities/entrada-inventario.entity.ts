export class EntradaInventario {
  constructor(
    public readonly id: string,
    public readonly productoId: string,
    public readonly bodegaId: string,
    public readonly ordenCompraId: string | null,
    public readonly cantidad: number,
    public readonly fecha: Date,
  ) {}
}
