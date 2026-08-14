import {
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  Min,
} from 'class-validator';

export class CrearSalidaInventarioDto {
  @IsUUID()
  productoId: string;

  @IsUUID()
  bodegaId: string;

  @IsInt()
  @Min(1)
  cantidad: number;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  motivo?: string | null;
}
