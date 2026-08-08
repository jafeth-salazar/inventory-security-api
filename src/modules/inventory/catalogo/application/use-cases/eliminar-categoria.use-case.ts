import { Inject, Injectable } from '@nestjs/common';

import { EntidadNoEncontradaError } from '../../../../shared/domain/errors/entidad-no-encontrada.error';
import { CATEGORIA_REPOSITORY } from '../../domain/ports/categoria-repository.port';
import type { CategoriaRepositoryPort } from '../../domain/ports/categoria-repository.port';

@Injectable()
export class EliminarCategoria {
  constructor(
    @Inject(CATEGORIA_REPOSITORY)
    private readonly categoriaRepository: CategoriaRepositoryPort,
  ) {}

  async ejecutar(id: string): Promise<void> {
    const existente = await this.categoriaRepository.obtenerPorId(id);
    if (!existente) {
      throw new EntidadNoEncontradaError('Categoria', id);
    }
    await this.categoriaRepository.eliminar(id);
  }
}
