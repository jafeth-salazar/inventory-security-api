import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/infrastructure/auth.module';
import { InventoryModule } from './modules/inventory/inventory.module';
import { SharedModule } from './modules/shared/infrastructure/shared.module';

@Module({
  imports: [SharedModule, AuthModule, InventoryModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
