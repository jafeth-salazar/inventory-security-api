export class SalidaInventario {
  constructor(
    public readonly id: string,
    public readonly productoId: string,
    public readonly bodegaId: string,
    public readonly cantidad: number,
    public readonly motivo: string | null,
    public readonly fecha: Date,
  ) {}
}
