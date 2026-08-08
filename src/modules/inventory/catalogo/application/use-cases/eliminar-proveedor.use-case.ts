import { Inject, Injectable } from '@nestjs/common';

import { EntidadNoEncontradaError } from '../../../../shared/domain/errors/entidad-no-encontrada.error';
import { PROVEEDOR_REPOSITORY } from '../../domain/ports/proveedor-repository.port';
import type { ProveedorRepositoryPort } from '../../domain/ports/proveedor-repository.port';

@Injectable()
export class EliminarProveedor {
  constructor(
    @Inject(PROVEEDOR_REPOSITORY)
    private readonly proveedorRepository: ProveedorRepositoryPort,
  ) {}

  async ejecutar(id: string): Promise<void> {
    const existente = await this.proveedorRepository.obtenerPorId(id);
    if (!existente) {
      throw new EntidadNoEncontradaError('Proveedor', id);
    }
    await this.proveedorRepository.eliminar(id);
  }
}
