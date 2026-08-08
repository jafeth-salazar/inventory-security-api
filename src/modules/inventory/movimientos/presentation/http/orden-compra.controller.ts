import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
} from '@nestjs/common';

import { EntidadNoEncontradaError } from '../../../../shared/domain/errors/entidad-no-encontrada.error';
import { ListarOrdenesCompra } from '../../application/use-cases/listar-ordenes-compra.use-case';
import { ObtenerOrdenCompraPorId } from '../../application/use-cases/obtener-orden-compra-por-id.use-case';
import { RegistrarOrdenCompra } from '../../application/use-cases/registrar-orden-compra.use-case';
import { OrdenCompra } from '../../domain/entities/orden-compra.entity';

import { CrearOrdenCompraDto } from './dto/crear-orden-compra.dto';

@Controller('ordenes-compra')
export class OrdenCompraController {
  constructor(
    private readonly registrarOrdenCompra: RegistrarOrdenCompra,
    private readonly listarOrdenesCompra: ListarOrdenesCompra,
    private readonly obtenerOrdenCompraPorId: ObtenerOrdenCompraPorId,
  ) {}

  @Post()
  async crear(@Body() dto: CrearOrdenCompraDto): Promise<OrdenCompra> {
    return this.registrarOrdenCompra.ejecutar({
      proveedorId: dto.proveedorId,
      total: dto.total,
    });
  }

  @Get()
  async listar(): Promise<OrdenCompra[]> {
    return this.listarOrdenesCompra.ejecutar();
  }

  @Get(':id')
  async obtener(@Param('id') id: string): Promise<OrdenCompra> {
    try {
      return await this.obtenerOrdenCompraPorId.ejecutar(id);
    } catch (error) {
      if (error instanceof EntidadNoEncontradaError) {
        throw new NotFoundException(error.message);
      }
      throw error;
    }
  }
}
