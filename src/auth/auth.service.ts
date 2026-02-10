import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt'

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const user = await this.usersService.createUser({
      email: dto.email,
      password: dto.password,
      organizationId: dto.organizationId,
      role: dto.role,
    });

    const token = this.jwtService.sign({
      userId: user.id,
      orgId: user.organization.id,
      role: user.role,
    });

    return { message: 'User registered successfully', token };
  }
  async login(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) throw new BadRequestException('Invalid credentials');

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new BadRequestException('Invalid credentials');

    const token = this.jwtService.sign({
      userId: user.id,
      organiztionId: user.organization.id,
      role: user.role,
    });

    return { message: 'Login successful', token };
  }



}
