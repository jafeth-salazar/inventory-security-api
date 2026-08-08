import { Inject, Injectable } from '@nestjs/common';

import { EntidadNoEncontradaError } from '../../../../shared/domain/errors/entidad-no-encontrada.error';
import { SalidaInventario } from '../../domain/entities/salida-inventario.entity';
import { SALIDA_INVENTARIO_REPOSITORY } from '../../domain/ports/salida-inventario-repository.port';
import type { SalidaInventarioRepositoryPort } from '../../domain/ports/salida-inventario-repository.port';

@Injectable()
export class ObtenerSalidaInventarioPorId {
  constructor(
    @Inject(SALIDA_INVENTARIO_REPOSITORY)
    private readonly salidaInventarioRepository: SalidaInventarioRepositoryPort,
  ) {}

  async ejecutar(id: string): Promise<SalidaInventario> {
    const salida = await this.salidaInventarioRepository.obtenerPorId(id);
    if (!salida) {
      throw new EntidadNoEncontradaError('SalidaInventario', id);
    }
    return salida;
  }
}
