import { Module } from '@nestjs/common';

import { CatalogoModule } from './catalogo/infrastructure/catalogo.module';
import { MovimientosModule } from './movimientos/infrastructure/movimientos.module';

@Module({
  imports: [CatalogoModule, MovimientosModule],
})
export class InventoryModule {}
