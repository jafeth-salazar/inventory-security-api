import { IsNotEmpty, IsString } from 'class-validator';

export class LoginRequestDto {
  @IsString()
  @IsNotEmpty()
  usuario: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
