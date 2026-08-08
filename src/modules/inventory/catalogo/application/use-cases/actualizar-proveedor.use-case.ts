import { Inject, Injectable } from '@nestjs/common';

import { EntidadNoEncontradaError } from '../../../../shared/domain/errors/entidad-no-encontrada.error';
import { Proveedor } from '../../domain/entities/proveedor.entity';
import { PROVEEDOR_REPOSITORY } from '../../domain/ports/proveedor-repository.port';
import type {
  DatosActualizarProveedor,
  ProveedorRepositoryPort,
} from '../../domain/ports/proveedor-repository.port';

@Injectable()
export class ActualizarProveedor {
  constructor(
    @Inject(PROVEEDOR_REPOSITORY)
    private readonly proveedorRepository: ProveedorRepositoryPort,
  ) {}

  async ejecutar(
    id: string,
    cambios: DatosActualizarProveedor,
  ): Promise<Proveedor> {
    const existente = await this.proveedorRepository.obtenerPorId(id);
    if (!existente) {
      throw new EntidadNoEncontradaError('Proveedor', id);
    }
    if (Object.keys(cambios).length === 0) {
      return existente;
    }
    return this.proveedorRepository.actualizar(id, cambios);
  }
}
