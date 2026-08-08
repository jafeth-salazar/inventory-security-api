import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
} from '@nestjs/common';

import { ActualizarProveedor } from '../../application/use-cases/actualizar-proveedor.use-case';
import { CrearProveedor } from '../../application/use-cases/crear-proveedor.use-case';
import { EliminarProveedor } from '../../application/use-cases/eliminar-proveedor.use-case';
import { ListarProveedores } from '../../application/use-cases/listar-proveedores.use-case';
import { ObtenerProveedorPorId } from '../../application/use-cases/obtener-proveedor-por-id.use-case';
import { Proveedor } from '../../domain/entities/proveedor.entity';

import { ActualizarProveedorDto } from './dto/actualizar-proveedor.dto';
import { CrearProveedorDto } from './dto/crear-proveedor.dto';

@Controller('proveedores')
export class ProveedorController {
  constructor(
    private readonly crearProveedor: CrearProveedor,
    private readonly listarProveedores: ListarProveedores,
    private readonly obtenerProveedorPorId: ObtenerProveedorPorId,
    private readonly actualizarProveedor: ActualizarProveedor,
    private readonly eliminarProveedor: EliminarProveedor,
  ) {}

  @Post()
  async crear(@Body() dto: CrearProveedorDto): Promise<Proveedor> {
    return this.crearProveedor.ejecutar({
      nombre: dto.nombre,
      telefono: dto.telefono ?? null,
      correo: dto.correo ?? null,
      direccion: dto.direccion ?? null,
    });
  }

  @Get()
  async listar(): Promise<Proveedor[]> {
    return this.listarProveedores.ejecutar();
  }

  @Get(':id')
  async obtener(@Param('id') id: string): Promise<Proveedor> {
    return this.obtenerProveedorPorId.ejecutar(id);
  }

  @Patch(':id')
  async actualizar(
    @Param('id') id: string,
    @Body() dto: ActualizarProveedorDto,
  ): Promise<Proveedor> {
    return this.actualizarProveedor.ejecutar(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async eliminar(@Param('id') id: string): Promise<void> {
    return this.eliminarProveedor.ejecutar(id);
  }
}
