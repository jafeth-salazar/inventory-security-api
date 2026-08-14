import { Producto } from '../entities/producto.entity';

export interface DatosCrearProducto {
  nombre: string;
  descripcion: string | null;
  precioUnitario: string;
  categoriaId: string;
  proveedorId: string | null;
}

export interface DatosActualizarProducto {
  nombre?: string;
  descripcion?: string | null;
  precioUnitario?: string;
  categoriaId?: string;
  proveedorId?: string | null;
}

export const PRODUCTO_REPOSITORY = Symbol('PRODUCTO_REPOSITORY');

export interface ProductoRepositoryPort {
  crear(datos: DatosCrearProducto): Promise<Producto>;
  listar(): Promise<Producto[]>;
  obtenerPorId(id: string): Promise<Producto | null>;
  actualizar(id: string, cambios: DatosActualizarProducto): Promise<Producto>;
  eliminar(id: string): Promise<void>;
}
