import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
} from '@nestjs/common';

import { EntidadNoEncontradaError } from '../../../../shared/domain/errors/entidad-no-encontrada.error';
import { ListarEntradasInventario } from '../../application/use-cases/listar-entradas-inventario.use-case';
import { ObtenerEntradaInventarioPorId } from '../../application/use-cases/obtener-entrada-inventario-por-id.use-case';
import { RegistrarEntradaInventario } from '../../application/use-cases/registrar-entrada-inventario.use-case';
import { EntradaInventario } from '../../domain/entities/entrada-inventario.entity';

import { CrearEntradaInventarioDto } from './dto/crear-entrada-inventario.dto';

@Controller('entradas-inventario')
export class EntradaInventarioController {
  constructor(
    private readonly registrarEntradaInventario: RegistrarEntradaInventario,
    private readonly listarEntradasInventario: ListarEntradasInventario,
    private readonly obtenerEntradaInventarioPorId: ObtenerEntradaInventarioPorId,
  ) {}

  @Post()
  async crear(
    @Body() dto: CrearEntradaInventarioDto,
  ): Promise<EntradaInventario> {
    return this.registrarEntradaInventario.ejecutar({
      productoId: dto.productoId,
      bodegaId: dto.bodegaId,
      ordenCompraId: dto.ordenCompraId ?? null,
      cantidad: dto.cantidad,
    });
  }

  @Get()
  async listar(): Promise<EntradaInventario[]> {
    return this.listarEntradasInventario.ejecutar();
  }

  @Get(':id')
  async obtener(@Param('id') id: string): Promise<EntradaInventario> {
    try {
      return await this.obtenerEntradaInventarioPorId.ejecutar(id);
    } catch (error) {
      if (error instanceof EntidadNoEncontradaError) {
        throw new NotFoundException(error.message);
      }
      throw error;
    }
  }
}
