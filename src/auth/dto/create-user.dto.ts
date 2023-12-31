import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsEmail({}, { message: 'Favor de insertar un correo válido' })
  email: string;

  @IsString()
  @IsNotEmpty({ message: () => 'La contraseña no puede estar vacía' })
  password: string;
}
