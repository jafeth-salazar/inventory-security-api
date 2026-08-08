import { Inject, Injectable } from '@nestjs/common';

import { Proveedor } from '../../domain/entities/proveedor.entity';
import { PROVEEDOR_REPOSITORY } from '../../domain/ports/proveedor-repository.port';
import type {
  DatosCrearProveedor,
  ProveedorRepositoryPort,
} from '../../domain/ports/proveedor-repository.port';

@Injectable()
export class CrearProveedor {
  constructor(
    @Inject(PROVEEDOR_REPOSITORY)
    private readonly proveedorRepository: ProveedorRepositoryPort,
  ) {}

  async ejecutar(datos: DatosCrearProveedor): Promise<Proveedor> {
    return this.proveedorRepository.crear(datos);
  }
}
