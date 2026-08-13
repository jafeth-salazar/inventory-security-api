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
    // Visor de auditoría estático (Parte 3 del enunciado) — vive fuera de
    // src/ (carpeta web/, igual que sql/ o bruno/), es un cliente HTTP más
    // de la API, no un módulo de la arquitectura hexagonal. Se sirve desde
    // el mismo proceso para que no haga falta CORS entre dos orígenes.
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'web'),
      serveRoot: '/auditoria',
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
