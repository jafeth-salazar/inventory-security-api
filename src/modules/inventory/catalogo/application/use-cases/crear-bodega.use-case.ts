import { Inject, Injectable } from '@nestjs/common';

import { Bodega } from '../../domain/entities/bodega.entity';
import { BODEGA_REPOSITORY } from '../../domain/ports/bodega-repository.port';
import type {
  BodegaRepositoryPort,
  DatosCrearBodega,
} from '../../domain/ports/bodega-repository.port';

@Injectable()
export class CrearBodega {
  constructor(
    @Inject(BODEGA_REPOSITORY)
    private readonly bodegaRepository: BodegaRepositoryPort,
  ) {}

  async ejecutar(datos: DatosCrearBodega): Promise<Bodega> {
    return this.bodegaRepository.crear(datos);
  }
}
