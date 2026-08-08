import { IsOptional, IsString, MaxLength } from 'class-validator';

export class ActualizarBodegaDto {
  @IsOptional()
  @IsString()
  @MaxLength(100)
  nombre?: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  ubicacion?: string | null;
}
