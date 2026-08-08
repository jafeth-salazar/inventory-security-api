import { Inject, Injectable } from '@nestjs/common';

import { EntidadNoEncontradaError } from '../../../../shared/domain/errors/entidad-no-encontrada.error';
import { Proveedor } from '../../domain/entities/proveedor.entity';
import { PROVEEDOR_REPOSITORY } from '../../domain/ports/proveedor-repository.port';
import type { ProveedorRepositoryPort } from '../../domain/ports/proveedor-repository.port';

@Injectable()
export class ObtenerProveedorPorId {
  constructor(
    @Inject(PROVEEDOR_REPOSITORY)
    private readonly proveedorRepository: ProveedorRepositoryPort,
  ) {}

  async ejecutar(id: string): Promise<Proveedor> {
    const proveedor = await this.proveedorRepository.obtenerPorId(id);
    if (!proveedor) {
      throw new EntidadNoEncontradaError('Proveedor', id);
    }
    return proveedor;
  }
}
