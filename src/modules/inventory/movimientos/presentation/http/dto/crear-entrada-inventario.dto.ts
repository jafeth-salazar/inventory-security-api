import { IsInt, IsOptional, IsUUID, Min } from 'class-validator';

export class CrearEntradaInventarioDto {
  @IsUUID()
  productoId: string;

  @IsUUID()
  bodegaId: string;

  @IsOptional()
  @IsUUID()
  ordenCompraId?: string | null;

  @IsInt()
  @Min(1)
  cantidad: number;
}
