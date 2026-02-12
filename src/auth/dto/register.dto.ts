import { IsEmail, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class RegisterDto {
  @IsNotEmpty()
  name: string;

  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;

  @Type(() => Number)
  @IsNumber()
  organizationId: number;

  @IsOptional()
  isVerified?: boolean;

}
