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
import { ActualizarProducto } from '../../application/use-cases/actualizar-producto.use-case';
import { CrearProducto } from '../../application/use-cases/crear-producto.use-case';
import { EliminarProducto } from '../../application/use-cases/eliminar-producto.use-case';
import { ListarProductos } from '../../application/use-cases/listar-productos.use-case';
import { ObtenerProductoPorId } from '../../application/use-cases/obtener-producto-por-id.use-case';
import { Producto } from '../../domain/entities/producto.entity';

import { ActualizarProductoDto } from './dto/actualizar-producto.dto';
import { CrearProductoDto } from './dto/crear-producto.dto';

@Controller('productos')
export class ProductoController {
  constructor(
    private readonly crearProducto: CrearProducto,
    private readonly listarProductos: ListarProductos,
    private readonly obtenerProductoPorId: ObtenerProductoPorId,
    private readonly actualizarProducto: ActualizarProducto,
    private readonly eliminarProducto: EliminarProducto,
  ) {}

  @Post()
  async crear(@Body() dto: CrearProductoDto): Promise<Producto> {
    return this.crearProducto.ejecutar({
      nombre: dto.nombre,
      descripcion: dto.descripcion ?? null,
      precioUnitario: dto.precioUnitario,
      categoriaId: dto.categoriaId,
      proveedorId: dto.proveedorId ?? null,
    });
  }

  @Get()
  async listar(): Promise<Producto[]> {
    return this.listarProductos.ejecutar();
  }

  @Get(':id')
  async obtener(@Param('id') id: string): Promise<Producto> {
    return this.manejarNoEncontrada(() =>
      this.obtenerProductoPorId.ejecutar(id),
    );
  }

  @Patch(':id')
  async actualizar(
    @Param('id') id: string,
    @Body() dto: ActualizarProductoDto,
  ): Promise<Producto> {
    return this.manejarNoEncontrada(() =>
      this.actualizarProducto.ejecutar(id, dto),
    );
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async eliminar(@Param('id') id: string): Promise<void> {
    return this.manejarNoEncontrada(() => this.eliminarProducto.ejecutar(id));
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
