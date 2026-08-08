import { Inject, Injectable } from '@nestjs/common';

import { Categoria } from '../../domain/entities/categoria.entity';
import { CATEGORIA_REPOSITORY } from '../../domain/ports/categoria-repository.port';
import type { CategoriaRepositoryPort } from '../../domain/ports/categoria-repository.port';

@Injectable()
export class ListarCategorias {
  constructor(
    @Inject(CATEGORIA_REPOSITORY)
    private readonly categoriaRepository: CategoriaRepositoryPort,
  ) {}

  async ejecutar(): Promise<Categoria[]> {
    return this.categoriaRepository.listar();
  }
}
