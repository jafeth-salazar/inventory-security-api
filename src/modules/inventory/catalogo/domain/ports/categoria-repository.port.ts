import { Categoria } from '../entities/categoria.entity';

export interface DatosCrearCategoria {
  nombre: string;
}

export interface DatosActualizarCategoria {
  nombre?: string;
}

export const CATEGORIA_REPOSITORY = Symbol('CATEGORIA_REPOSITORY');

export interface CategoriaRepositoryPort {
  crear(datos: DatosCrearCategoria): Promise<Categoria>;
  listar(): Promise<Categoria[]>;
  obtenerPorId(id: string): Promise<Categoria | null>;
  actualizar(id: string, cambios: DatosActualizarCategoria): Promise<Categoria>;
  eliminar(id: string): Promise<void>;
}
