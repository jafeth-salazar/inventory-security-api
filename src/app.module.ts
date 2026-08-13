import { join } from 'node:path';

import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuditModule } from './modules/audit/infrastructure/audit.module';
import { AuthModule } from './modules/auth/infrastructure/auth.module';
import { InventoryModule } from './modules/inventory/inventory.module';
import { SharedModule } from './modules/shared/infrastructure/shared.module';

@Module({
  imports: [
    // Páginas web estáticas (visor de auditoría de la Parte 3, y un CRUD de
    // inventario) — viven fuera de src/ (carpeta web/, igual que sql/ o
    // bruno/), son clientes HTTP más de la API, no módulos de la
    // arquitectura hexagonal. Se sirven desde el mismo proceso para que no
    // haga falta CORS entre dos orígenes.
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'web'),
      serveRoot: '/app',
    }),
    SharedModule,
    AuthModule,
    InventoryModule,
    AuditModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
