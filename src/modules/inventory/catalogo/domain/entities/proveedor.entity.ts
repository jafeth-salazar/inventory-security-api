export class Proveedor {
  constructor(
    public readonly id: string,
    public nombre: string,
    public telefono: string | null,
    public correo: string | null,
    public direccion: string | null,
  ) {}
}
