import { Bodega } from '../entities/bodega.entity';

export interface DatosCrearBodega {
  nombre: string;
  ubicacion: string | null;
}

export interface DatosActualizarBodega {
  nombre?: string;
  ubicacion?: string | null;
}

export const BODEGA_REPOSITORY = Symbol('BODEGA_REPOSITORY');

export interface BodegaRepositoryPort {
  crear(datos: DatosCrearBodega): Promise<Bodega>;
  listar(): Promise<Bodega[]>;
  obtenerPorId(id: string): Promise<Bodega | null>;
  actualizar(id: string, cambios: DatosActualizarBodega): Promise<Bodega>;
  eliminar(id: string): Promise<void>;
}
