import { Inject, Injectable } from '@nestjs/common';

import { Proveedor } from '../../domain/entities/proveedor.entity';
import { PROVEEDOR_REPOSITORY } from '../../domain/ports/proveedor-repository.port';
import type { ProveedorRepositoryPort } from '../../domain/ports/proveedor-repository.port';

@Injectable()
export class ListarProveedores {
  constructor(
    @Inject(PROVEEDOR_REPOSITORY)
    private readonly proveedorRepository: ProveedorRepositoryPort,
  ) {}

  async ejecutar(): Promise<Proveedor[]> {
    return this.proveedorRepository.listar();
  }
}
