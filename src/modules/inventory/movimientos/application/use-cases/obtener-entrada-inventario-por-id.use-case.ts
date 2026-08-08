import { Inject, Injectable } from '@nestjs/common';

import { EntidadNoEncontradaError } from '../../../../shared/domain/errors/entidad-no-encontrada.error';
import { EntradaInventario } from '../../domain/entities/entrada-inventario.entity';
import { ENTRADA_INVENTARIO_REPOSITORY } from '../../domain/ports/entrada-inventario-repository.port';
import type { EntradaInventarioRepositoryPort } from '../../domain/ports/entrada-inventario-repository.port';

@Injectable()
export class ObtenerEntradaInventarioPorId {
  constructor(
    @Inject(ENTRADA_INVENTARIO_REPOSITORY)
    private readonly entradaInventarioRepository: EntradaInventarioRepositoryPort,
  ) {}

  async ejecutar(id: string): Promise<EntradaInventario> {
    const entrada = await this.entradaInventarioRepository.obtenerPorId(id);
    if (!entrada) {
      throw new EntidadNoEncontradaError('EntradaInventario', id);
    }
    return entrada;
  }
}
