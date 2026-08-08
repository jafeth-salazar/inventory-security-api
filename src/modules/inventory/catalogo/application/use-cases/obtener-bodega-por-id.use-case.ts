import { Inject, Injectable } from '@nestjs/common';

import { EntidadNoEncontradaError } from '../../../../shared/domain/errors/entidad-no-encontrada.error';
import { Bodega } from '../../domain/entities/bodega.entity';
import { BODEGA_REPOSITORY } from '../../domain/ports/bodega-repository.port';
import type { BodegaRepositoryPort } from '../../domain/ports/bodega-repository.port';

@Injectable()
export class ObtenerBodegaPorId {
  constructor(
    @Inject(BODEGA_REPOSITORY)
    private readonly bodegaRepository: BodegaRepositoryPort,
  ) {}

  async ejecutar(id: string): Promise<Bodega> {
    const bodega = await this.bodegaRepository.obtenerPorId(id);
    if (!bodega) {
      throw new EntidadNoEncontradaError('Bodega', id);
    }
    return bodega;
  }
}
