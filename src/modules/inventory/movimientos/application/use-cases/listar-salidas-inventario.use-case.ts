import { Inject, Injectable } from '@nestjs/common';

import { SalidaInventario } from '../../domain/entities/salida-inventario.entity';
import { SALIDA_INVENTARIO_REPOSITORY } from '../../domain/ports/salida-inventario-repository.port';
import type { SalidaInventarioRepositoryPort } from '../../domain/ports/salida-inventario-repository.port';

@Injectable()
export class ListarSalidasInventario {
  constructor(
    @Inject(SALIDA_INVENTARIO_REPOSITORY)
    private readonly salidaInventarioRepository: SalidaInventarioRepositoryPort,
  ) {}

  async ejecutar(): Promise<SalidaInventario[]> {
    return this.salidaInventarioRepository.listar();
  }
}
