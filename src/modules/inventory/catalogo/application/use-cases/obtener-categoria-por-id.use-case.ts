import { Inject, Injectable } from '@nestjs/common';

import { EntidadNoEncontradaError } from '../../../../shared/domain/errors/entidad-no-encontrada.error';
import { Categoria } from '../../domain/entities/categoria.entity';
import { CATEGORIA_REPOSITORY } from '../../domain/ports/categoria-repository.port';
import type { CategoriaRepositoryPort } from '../../domain/ports/categoria-repository.port';

@Injectable()
export class ObtenerCategoriaPorId {
  constructor(
    @Inject(CATEGORIA_REPOSITORY)
    private readonly categoriaRepository: CategoriaRepositoryPort,
  ) {}

  async ejecutar(id: string): Promise<Categoria> {
    const categoria = await this.categoriaRepository.obtenerPorId(id);
    if (!categoria) {
      throw new EntidadNoEncontradaError('Categoria', id);
    }
    return categoria;
  }
}
