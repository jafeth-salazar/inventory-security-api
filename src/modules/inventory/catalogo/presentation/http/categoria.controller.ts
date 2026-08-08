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

import { ActualizarCategoria } from '../../application/use-cases/actualizar-categoria.use-case';
import { CrearCategoria } from '../../application/use-cases/crear-categoria.use-case';
import { EliminarCategoria } from '../../application/use-cases/eliminar-categoria.use-case';
import { ListarCategorias } from '../../application/use-cases/listar-categorias.use-case';
import { ObtenerCategoriaPorId } from '../../application/use-cases/obtener-categoria-por-id.use-case';
import { Categoria } from '../../domain/entities/categoria.entity';

import { ActualizarCategoriaDto } from './dto/actualizar-categoria.dto';
import { CrearCategoriaDto } from './dto/crear-categoria.dto';

@Controller('categorias')
export class CategoriaController {
  constructor(
    private readonly crearCategoria: CrearCategoria,
    private readonly listarCategorias: ListarCategorias,
    private readonly obtenerCategoriaPorId: ObtenerCategoriaPorId,
    private readonly actualizarCategoria: ActualizarCategoria,
    private readonly eliminarCategoria: EliminarCategoria,
  ) {}

  @Post()
  async crear(@Body() dto: CrearCategoriaDto): Promise<Categoria> {
    return this.crearCategoria.ejecutar({ nombre: dto.nombre });
  }

  @Get()
  async listar(): Promise<Categoria[]> {
    return this.listarCategorias.ejecutar();
  }

  @Get(':id')
  async obtener(@Param('id') id: string): Promise<Categoria> {
    return this.obtenerCategoriaPorId.ejecutar(id);
  }

  @Patch(':id')
  async actualizar(
    @Param('id') id: string,
    @Body() dto: ActualizarCategoriaDto,
  ): Promise<Categoria> {
    return this.actualizarCategoria.ejecutar(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async eliminar(@Param('id') id: string): Promise<void> {
    return this.eliminarCategoria.ejecutar(id);
  }
}
