import { Proveedor } from '../entities/proveedor.entity';

export interface DatosCrearProveedor {
  nombre: string;
  telefono: string | null;
  correo: string | null;
  direccion: string | null;
}

export interface DatosActualizarProveedor {
  nombre?: string;
  telefono?: string | null;
  correo?: string | null;
  direccion?: string | null;
}

export const PROVEEDOR_REPOSITORY = Symbol('PROVEEDOR_REPOSITORY');

export interface ProveedorRepositoryPort {
  crear(datos: DatosCrearProveedor): Promise<Proveedor>;
  listar(): Promise<Proveedor[]>;
  obtenerPorId(id: string): Promise<Proveedor | null>;
  actualizar(id: string, cambios: DatosActualizarProveedor): Promise<Proveedor>;
  eliminar(id: string): Promise<void>;
}
