import { Inject, Injectable } from '@nestjs/common';

import { EntradaInventario } from '../../domain/entities/entrada-inventario.entity';
import {
  DatosRegistrarEntradaInventario,
  ENTRADA_INVENTARIO_REPOSITORY,
} from '../../domain/ports/entrada-inventario-repository.port';
import type { EntradaInventarioRepositoryPort } from '../../domain/ports/entrada-inventario-repository.port';

@Injectable()
export class RegistrarEntradaInventario {
  constructor(
    @Inject(ENTRADA_INVENTARIO_REPOSITORY)
    private readonly entradaInventarioRepository: EntradaInventarioRepositoryPort,
  ) {}

  ejecutar(datos: DatosRegistrarEntradaInventario): Promise<EntradaInventario> {
    return this.entradaInventarioRepository.registrarConActualizacionDeStock(
      datos,
    );
  }
}
