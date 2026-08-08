import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Patch,
  Post,
} from '@nestjs/common';

import { EntidadNoEncontradaError } from '../../../../shared/domain/errors/entidad-no-encontrada.error';
import { ActualizarBodega } from '../../application/use-cases/actualizar-bodega.use-case';
import { CrearBodega } from '../../application/use-cases/crear-bodega.use-case';
import { EliminarBodega } from '../../application/use-cases/eliminar-bodega.use-case';
import { ListarBodegas } from '../../application/use-cases/listar-bodegas.use-case';
import { ObtenerBodegaPorId } from '../../application/use-cases/obtener-bodega-por-id.use-case';
import { Bodega } from '../../domain/entities/bodega.entity';

import { ActualizarBodegaDto } from './dto/actualizar-bodega.dto';
import { CrearBodegaDto } from './dto/crear-bodega.dto';

@Controller('bodegas')
export class BodegaController {
  constructor(
    private readonly crearBodega: CrearBodega,
    private readonly listarBodegas: ListarBodegas,
    private readonly obtenerBodegaPorId: ObtenerBodegaPorId,
    private readonly actualizarBodega: ActualizarBodega,
    private readonly eliminarBodega: EliminarBodega,
  ) {}

  @Post()
  async crear(@Body() dto: CrearBodegaDto): Promise<Bodega> {
    return this.crearBodega.ejecutar({
      nombre: dto.nombre,
      ubicacion: dto.ubicacion ?? null,
    });
  }

  @Get()
  async listar(): Promise<Bodega[]> {
    return this.listarBodegas.ejecutar();
  }

  @Get(':id')
  async obtener(@Param('id') id: string): Promise<Bodega> {
    return this.manejarNoEncontrada(() => this.obtenerBodegaPorId.ejecutar(id));
  }

  @Patch(':id')
  async actualizar(
    @Param('id') id: string,
    @Body() dto: ActualizarBodegaDto,
  ): Promise<Bodega> {
    return this.manejarNoEncontrada(() =>
      this.actualizarBodega.ejecutar(id, dto),
    );
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async eliminar(@Param('id') id: string): Promise<void> {
    return this.manejarNoEncontrada(() => this.eliminarBodega.ejecutar(id));
  }

  private async manejarNoEncontrada<T>(accion: () => Promise<T>): Promise<T> {
    try {
      return await accion();
    } catch (error) {
      if (error instanceof EntidadNoEncontradaError) {
        throw new NotFoundException(error.message);
      }
      throw error;
    }
  }
}
