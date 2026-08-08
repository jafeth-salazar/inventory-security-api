import { Module } from '@nestjs/common';

import { ListarEntradasInventario } from '../application/use-cases/listar-entradas-inventario.use-case';
import { ListarInventarioActual } from '../application/use-cases/listar-inventario-actual.use-case';
import { ListarOrdenesCompra } from '../application/use-cases/listar-ordenes-compra.use-case';
import { ListarSalidasInventario } from '../application/use-cases/listar-salidas-inventario.use-case';
import { ObtenerEntradaInventarioPorId } from '../application/use-cases/obtener-entrada-inventario-por-id.use-case';
import { ObtenerInventarioActualPorId } from '../application/use-cases/obtener-inventario-actual-por-id.use-case';
import { ObtenerOrdenCompraPorId } from '../application/use-cases/obtener-orden-compra-por-id.use-case';
import { ObtenerSalidaInventarioPorId } from '../application/use-cases/obtener-salida-inventario-por-id.use-case';
import { RegistrarEntradaInventario } from '../application/use-cases/registrar-entrada-inventario.use-case';
import { RegistrarOrdenCompra } from '../application/use-cases/registrar-orden-compra.use-case';
import { RegistrarSalidaInventario } from '../application/use-cases/registrar-salida-inventario.use-case';
import { ENTRADA_INVENTARIO_REPOSITORY } from '../domain/ports/entrada-inventario-repository.port';
import { INVENTARIO_ACTUAL_REPOSITORY } from '../domain/ports/inventario-actual-repository.port';
import { ORDEN_COMPRA_REPOSITORY } from '../domain/ports/orden-compra-repository.port';
import { SALIDA_INVENTARIO_REPOSITORY } from '../domain/ports/salida-inventario-repository.port';
import { EntradaInventarioController } from '../presentation/http/entrada-inventario.controller';
import { InventarioActualController } from '../presentation/http/inventario-actual.controller';
import { OrdenCompraController } from '../presentation/http/orden-compra.controller';
import { SalidaInventarioController } from '../presentation/http/salida-inventario.controller';

import { TypeOrmEntradaInventarioRepository } from './persistence/typeorm/repositories/typeorm-entrada-inventario.repository';
import { TypeOrmInventarioActualRepository } from './persistence/typeorm/repositories/typeorm-inventario-actual.repository';
import { TypeOrmOrdenCompraRepository } from './persistence/typeorm/repositories/typeorm-orden-compra.repository';
import { TypeOrmSalidaInventarioRepository } from './persistence/typeorm/repositories/typeorm-salida-inventario.repository';

@Module({
  controllers: [
    OrdenCompraController,
    EntradaInventarioController,
    SalidaInventarioController,
    InventarioActualController,
  ],
  providers: [
    {
      provide: ORDEN_COMPRA_REPOSITORY,
      useClass: TypeOrmOrdenCompraRepository,
    },
    {
      provide: ENTRADA_INVENTARIO_REPOSITORY,
      useClass: TypeOrmEntradaInventarioRepository,
    },
    {
      provide: SALIDA_INVENTARIO_REPOSITORY,
      useClass: TypeOrmSalidaInventarioRepository,
    },
    {
      provide: INVENTARIO_ACTUAL_REPOSITORY,
      useClass: TypeOrmInventarioActualRepository,
    },
    RegistrarOrdenCompra,
    ListarOrdenesCompra,
    ObtenerOrdenCompraPorId,
    RegistrarEntradaInventario,
    ListarEntradasInventario,
    ObtenerEntradaInventarioPorId,
    RegistrarSalidaInventario,
    ListarSalidasInventario,
    ObtenerSalidaInventarioPorId,
    ListarInventarioActual,
    ObtenerInventarioActualPorId,
  ],
})
export class MovimientosModule {}
