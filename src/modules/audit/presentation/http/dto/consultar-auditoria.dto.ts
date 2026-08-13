import { IsISO8601, IsOptional, IsString } from 'class-validator';

export class ConsultarAuditoriaDto {
  @IsOptional()
  @IsString()
  accion?: string;

  @IsOptional()
  @IsISO8601()
  desde?: string;

  @IsOptional()
  @IsISO8601()
  hasta?: string;

  @IsOptional()
  @IsString()
  usuario?: string;
}
