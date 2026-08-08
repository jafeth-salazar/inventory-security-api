import { Inject, Injectable } from '@nestjs/common';

import { EntidadNoEncontradaError } from '../../../../shared/domain/errors/entidad-no-encontrada.error';
import { Bodega } from '../../domain/entities/bodega.entity';
import { BODEGA_REPOSITORY } from '../../domain/ports/bodega-repository.port';
import type {
  BodegaRepositoryPort,
  DatosActualizarBodega,
} from '../../domain/ports/bodega-repository.port';

@Injectable()
export class ActualizarBodega {
  constructor(
    @Inject(BODEGA_REPOSITORY)
    private readonly bodegaRepository: BodegaRepositoryPort,
  ) {}

  async ejecutar(id: string, cambios: DatosActualizarBodega): Promise<Bodega> {
    const existente = await this.bodegaRepository.obtenerPorId(id);
    if (!existente) {
      throw new EntidadNoEncontradaError('Bodega', id);
    }
    if (Object.keys(cambios).length === 0) {
      return existente;
    }
    return this.bodegaRepository.actualizar(id, cambios);
  }
}
