import { IsNumberString, IsUUID } from 'class-validator';

export class CrearOrdenCompraDto {
  @IsUUID()
  proveedorId: string;

  @IsNumberString()
  total: string;
}
