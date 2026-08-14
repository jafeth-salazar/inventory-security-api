import { Inject, Injectable } from '@nestjs/common';

import { EntidadNoEncontradaError } from '../../../../shared/domain/errors/entidad-no-encontrada.error';
import { BODEGA_REPOSITORY } from '../../domain/ports/bodega-repository.port';
import type { BodegaRepositoryPort } from '../../domain/ports/bodega-repository.port';

@Injectable()
export class EliminarBodega {
  constructor(
    @Inject(BODEGA_REPOSITORY)
    private readonly bodegaRepository: BodegaRepositoryPort,
  ) {}

  async ejecutar(id: string): Promise<void> {
    const existente = await this.bodegaRepository.obtenerPorId(id);
    if (!existente) {
      throw new EntidadNoEncontradaError('Bodega', id);
    }
    await this.bodegaRepository.eliminar(id);
  }
}
