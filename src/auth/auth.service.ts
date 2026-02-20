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

  async register(dto: RegisterDto) {

    const userExists = await this.userRepo.findOne({ where: { email: dto.email } });
    console.log('User exists check:', userExists);
    if (userExists) throw new BadRequestException('Email already exists');

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    console.log('Hashed Password:', hashedPassword);

    const otp = Math.floor(100000 + Math.random() * 900000);
    console.log('Generated OTP:', otp);

    const user = this.userRepo.create({
      name: dto.name,
      email: dto.email,
      password: hashedPassword,
      isVerified: false,
      organizationId: dto.organizationId,
      // otp: otp.toString(),
      // otpExpiry: new Date(Date.now() + 5 * 60 * 1000),
    });
    console.log('New User Entity:', user);
    const savedUser = await this.userRepo.save(user);

    await this.otpRepo.save({
      email: dto.email,
      code: otp,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000),
      tempPassword: dto.password,
    });
    console.log('Saved User:', savedUser);
    await this.mailService.sendOtp(dto.email, otp);
    await this.otpRepo.update({ email: dto.email }, { tempPassword: dto.password });
    return { message: 'User registered. OTP and credentials sent to email.' };
  }

  async verifyOtp(email: string, code: number) {
    const otpEntry = await this.otpRepo.findOne({ where: { email, code } });

    if (!otpEntry) throw new BadRequestException("OTP invalid");

    if (otpEntry.expiresAt < new Date())
      throw new BadRequestException("OTP expired");

    const user = await this.userRepo.findOne({ where: { email } });
    if (!user) throw new BadRequestException("User not found");

    user.isVerified = true;
    await this.userRepo.save(user);

    // send credentials email
    await this.mailService.sendCredentials(
      email,
      user.name,
      otpEntry.tempPassword ?? "Your chosen password"
    );

    await this.otpRepo.delete({ email });

    return { message: "User verified successfully" };
  }


  async login(email: string, password: string) {
    const user = await this.userRepo.findOne({ where: { email } });
    if (!user) throw new BadRequestException("User not found");

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new BadRequestException("Invalid email or password");

    // if (!user.isVerified) {
    //   const otp = Math.floor(100000 + Math.random() * 900000);

    //   await this.otpRepo.save({
    //     email: user.email,
    //     code: otp,
    //     expiresAt: new Date(Date.now() + 5 * 60 * 1000),
    //   });

    //   await this.mailService.sendOtp(user.email, otp);

    //   return {
    //     message: "Account not verified. OTP sent to email",
    //     requiresVerification: true
    //   };
    // }

    return { message: "Login successful", accessToken: this.jwtService.sign({ sub: user.id, email: user.email }, { expiresIn: '1h' }), refreshToken: this.jwtService.sign({ sub: user.id, email: user.email }, { expiresIn: '7d', secret: process.env.JWT_REFRESH_SECRET || 'refreshSecretKey' }) };
  }


  async refreshToken(token: string) {
    try {
      const payload = this.jwtService.verify(token, {
        secret: process.env.JWT_REFRESH_SECRET || 'refreshSecretKey',
        algorithms: ['HS256'],
      });
      const user = await this.userRepo.findOne({
        where: { id: payload.sub },
      });
      if (!user) throw new UnauthorizedException('User not found');
      const accessToken = this.jwtService.sign(
        { sub: user.id, email: user.email },
        { expiresIn: '1h' },
      );
      return { accessToken };

    } catch (err) {
      console.log('Refresh error:', err.message);
      throw new UnauthorizedException('Invalid or expired refresh token');
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

