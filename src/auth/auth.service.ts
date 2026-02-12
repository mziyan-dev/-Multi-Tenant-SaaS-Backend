import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt'
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { Organization } from 'src/organization/entities/organization.entity';
import { MailService } from 'src/mail/mail.service';
import { Otp } from './entities/OTP.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(Organization)
    private readonly orgRepo: Repository<Organization>,
    private jwtService: JwtService,
    @InjectRepository(Otp) private otpRepo: Repository<Otp>,
    private mailService: MailService,
  ) { }

  private generateOtp(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  async register(dto: RegisterDto) {
    const userExists = await this.userRepo.findOne({ where: { email: dto.email } });
    if (userExists) throw new BadRequestException('Email already exists');

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const user = this.userRepo.create({
      name: dto.name,
      email: dto.email,
      password: hashedPassword,
      isVerified: dto.isVerified ?? false,
      organizationId: dto.organizationId,
    });

    await this.userRepo.save(user);

    const otp = Math.floor(100000 + Math.random() * 900000);
    await this.mailService.sendOtp(dto.email, otp); // 6-digit OTP

    await this.otpRepo.save({
      email: dto.email,
      code: otp,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes
    });

    await this.mailService.sendOtp(dto.email, otp);

    return { message: 'OTP sent to your email' };
  }

  async verifyOtp(email: string, code: number) {
    const otpEntry = await this.otpRepo.findOne({ where: { email, code } });
    if (!otpEntry || otpEntry.expiresAt < new Date()) {
      throw new BadRequestException('OTP invalid or expired');
    }

    const user = await this.userRepo.findOne({ where: { email } });
    if (!user) throw new BadRequestException('User not found');
    user.isVerified = true;
    await this.userRepo.save(user);

    await this.otpRepo.delete({ email, code });

    return { message: 'User verified successfully' };
  }


  async login(email: string, password: string) {
    const user = await this.userRepo.findOne({ where: { email } });
    if (!user) throw new BadRequestException("User not found");

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new BadRequestException("Invalid credentials");

    if (!user.isVerified) throw new UnauthorizedException("Verify email first");

    return { message: "Login successful" };
  }

  async refreshToken(token: string) {
    try {
      const payload = this.jwtService.verify(token, {
        secret: process.env.JWT_REFRESH_SECRET || 'refreshSecretKey',
      });

      const user = await this.userRepo.findOne({ where: { id: payload.sub } });
      if (!user) throw new UnauthorizedException('User not found');

      const accessToken = this.jwtService.sign(
        { sub: user.id, email: user.email },
        { expiresIn: '1h' },
      );

      return { accessToken };
    } catch (err) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

}


// token generate hoa haroon ke liye  sdfd1f3sd56f156d
// otp generate hoa haroon ke liye 123456
// otpExpiry hoa haroon ke liye 2024-06-30T03:04:00.000Z 5 minutes

// new api verify otp
// otp  body me or token  header me
// sab se pehle token verify kare ge ke expire na ho
// token valid hua to ye check kar na hai ke token haroon ka hi ho
// token valid hua to otp check karna hai ke 123456 hai ya nahi
// otp valid hua to DB me otp aur otpExpiry null kar dena hai
// or response me success message dena hai
// otp valid nahi hua to error message dena hai

