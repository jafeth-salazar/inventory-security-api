import {
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
} from 'class-validator';

export class CrearProductoDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  nombre: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  descripcion?: string | null;

  @IsNumberString()
  precioUnitario: string;

  @IsUUID()
  categoriaId: string;

  @IsOptional()
  @IsUUID()
  proveedorId?: string | null;
}
