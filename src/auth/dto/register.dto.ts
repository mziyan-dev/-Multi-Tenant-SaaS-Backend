import { IsEmail, IsEnum, IsNotEmpty, IsOptional, MinLength } from 'class-validator';
import { Role } from 'src/users/entities/roles.enum';

export class RegisterDto {
  @IsEmail()
  email: string;

  @MinLength(6)
  password: string;

  @IsNotEmpty()
  organizationId: number;


  @IsOptional()
  @IsEnum(Role)
  role?: Role;
}