import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CrearBodegaDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  nombre: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  ubicacion?: string | null;
}
