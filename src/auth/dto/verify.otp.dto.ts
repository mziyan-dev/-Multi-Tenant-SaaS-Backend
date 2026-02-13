import { IsEmail, IsNotEmpty, IsNumber } from 'class-validator';


export class VerifyOtpDto {
  @IsEmail()
  email: string;

  @IsNumber()
  @IsNotEmpty()
  code: number;


}