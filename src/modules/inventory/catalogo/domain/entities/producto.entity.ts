export class Producto {
  constructor(
    public readonly id: string,
    public nombre: string,
    public descripcion: string | null,
    public precioUnitario: string,
    public categoriaId: string,
    public proveedorId: string | null,
  ) {}
}
