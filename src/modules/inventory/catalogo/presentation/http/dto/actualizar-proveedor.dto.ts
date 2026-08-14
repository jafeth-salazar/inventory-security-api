import { IsEmail, IsOptional, IsString, MaxLength } from 'class-validator';

export class ActualizarProveedorDto {
  @IsOptional()
  @IsString()
  @MaxLength(150)
  nombre?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  telefono?: string | null;

  @IsOptional()
  @IsEmail()
  @MaxLength(150)
  correo?: string | null;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  direccion?: string | null;
}
