import { IsBoolean,  IsEmail, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
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

  // @IsBoolean()
  // isVerified?: boolean;

  // @IsNumber()
  // otp?: number;

  // @Type(() => Date)
  // otpExpiry?: Date;

}
