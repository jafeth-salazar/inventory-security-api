export class OrdenCompra {
  constructor(
    public readonly id: string,
    public readonly proveedorId: string,
    public readonly fecha: Date,
    public readonly total: string,
  ) {}
}
