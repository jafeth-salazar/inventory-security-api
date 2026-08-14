import {
  IsNumberString,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
} from 'class-validator';

export class ActualizarProductoDto {
  @IsOptional()
  @IsString()
  @MaxLength(150)
  nombre?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  descripcion?: string | null;

  @IsOptional()
  @IsNumberString()
  precioUnitario?: string;

  @IsOptional()
  @IsUUID()
  categoriaId?: string;

  @IsOptional()
  @IsUUID()
  proveedorId?: string | null;
}
