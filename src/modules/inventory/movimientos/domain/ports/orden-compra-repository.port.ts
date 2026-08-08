import { OrdenCompra } from '../entities/orden-compra.entity';

export interface DatosRegistrarOrdenCompra {
  proveedorId: string;
  total: string;
}

export const ORDEN_COMPRA_REPOSITORY = Symbol('ORDEN_COMPRA_REPOSITORY');

export interface OrdenCompraRepositoryPort {
  registrar(datos: DatosRegistrarOrdenCompra): Promise<OrdenCompra>;
  listar(): Promise<OrdenCompra[]>;
  obtenerPorId(id: string): Promise<OrdenCompra | null>;
}
