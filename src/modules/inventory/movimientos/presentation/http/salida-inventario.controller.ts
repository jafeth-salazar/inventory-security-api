import {
  BadRequestException,
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
} from '@nestjs/common';

import { EntidadNoEncontradaError } from '../../../../shared/domain/errors/entidad-no-encontrada.error';
import { ListarSalidasInventario } from '../../application/use-cases/listar-salidas-inventario.use-case';
import { ObtenerSalidaInventarioPorId } from '../../application/use-cases/obtener-salida-inventario-por-id.use-case';
import { RegistrarSalidaInventario } from '../../application/use-cases/registrar-salida-inventario.use-case';
import { SalidaInventario } from '../../domain/entities/salida-inventario.entity';
import { StockInsuficienteError } from '../../domain/errors/stock-insuficiente.error';

import { CrearSalidaInventarioDto } from './dto/crear-salida-inventario.dto';

@Controller('salidas-inventario')
export class SalidaInventarioController {
  constructor(
    private readonly registrarSalidaInventario: RegistrarSalidaInventario,
    private readonly listarSalidasInventario: ListarSalidasInventario,
    private readonly obtenerSalidaInventarioPorId: ObtenerSalidaInventarioPorId,
  ) {}

  @Post()
  async crear(
    @Body() dto: CrearSalidaInventarioDto,
  ): Promise<SalidaInventario> {
    try {
      return await this.registrarSalidaInventario.ejecutar({
        productoId: dto.productoId,
        bodegaId: dto.bodegaId,
        cantidad: dto.cantidad,
        motivo: dto.motivo ?? null,
      });
    } catch (error) {
      if (error instanceof StockInsuficienteError) {
        throw new BadRequestException(error.message);
      }
      throw error;
    }
  }

  @Get()
  async listar(): Promise<SalidaInventario[]> {
    return this.listarSalidasInventario.ejecutar();
  }

  @Get(':id')
  async obtener(@Param('id') id: string): Promise<SalidaInventario> {
    try {
      return await this.obtenerSalidaInventarioPorId.ejecutar(id);
    } catch (error) {
      if (error instanceof EntidadNoEncontradaError) {
        throw new NotFoundException(error.message);
      }
      throw error;
    }
  }
}
