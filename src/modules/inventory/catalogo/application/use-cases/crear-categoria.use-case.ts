import { Inject, Injectable } from '@nestjs/common';

import { Categoria } from '../../domain/entities/categoria.entity';
import { CATEGORIA_REPOSITORY } from '../../domain/ports/categoria-repository.port';
import type {
  CategoriaRepositoryPort,
  DatosCrearCategoria,
} from '../../domain/ports/categoria-repository.port';

@Injectable()
export class CrearCategoria {
  constructor(
    @Inject(CATEGORIA_REPOSITORY)
    private readonly categoriaRepository: CategoriaRepositoryPort,
  ) {}

  async ejecutar(datos: DatosCrearCategoria): Promise<Categoria> {
    return this.categoriaRepository.crear(datos);
  }
}
