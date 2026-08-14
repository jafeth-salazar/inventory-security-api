import { Body, Controller, Get, Param, Post } from '@nestjs/common';

import { ListarSalidasInventario } from '../../application/use-cases/listar-salidas-inventario.use-case';
import { ObtenerSalidaInventarioPorId } from '../../application/use-cases/obtener-salida-inventario-por-id.use-case';
import { RegistrarSalidaInventario } from '../../application/use-cases/registrar-salida-inventario.use-case';
import { SalidaInventario } from '../../domain/entities/salida-inventario.entity';

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
    return this.registrarSalidaInventario.ejecutar({
      productoId: dto.productoId,
      bodegaId: dto.bodegaId,
      cantidad: dto.cantidad,
      motivo: dto.motivo ?? null,
    });
  }

  @Get()
  async listar(): Promise<SalidaInventario[]> {
    return this.listarSalidasInventario.ejecutar();
  }

  @Get(':id')
  async obtener(@Param('id') id: string): Promise<SalidaInventario> {
    return this.obtenerSalidaInventarioPorId.ejecutar(id);
  }
}
