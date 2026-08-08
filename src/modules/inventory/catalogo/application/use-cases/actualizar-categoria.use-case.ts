import { Inject, Injectable } from '@nestjs/common';

import { EntidadNoEncontradaError } from '../../../../shared/domain/errors/entidad-no-encontrada.error';
import { Categoria } from '../../domain/entities/categoria.entity';
import { CATEGORIA_REPOSITORY } from '../../domain/ports/categoria-repository.port';
import type {
  CategoriaRepositoryPort,
  DatosActualizarCategoria,
} from '../../domain/ports/categoria-repository.port';

@Injectable()
export class ActualizarCategoria {
  constructor(
    @Inject(CATEGORIA_REPOSITORY)
    private readonly categoriaRepository: CategoriaRepositoryPort,
  ) {}

  async ejecutar(
    id: string,
    cambios: DatosActualizarCategoria,
  ): Promise<Categoria> {
    const existente = await this.categoriaRepository.obtenerPorId(id);
    if (!existente) {
      throw new EntidadNoEncontradaError('Categoria', id);
    }
    return this.categoriaRepository.actualizar(id, cambios);
  }
}
