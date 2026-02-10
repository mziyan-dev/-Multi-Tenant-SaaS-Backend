import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user-dto';
import { Organization } from 'src/organization/entities/organization.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
    @InjectRepository(Organization)
    private orgRepo: Repository<Organization>,
  ) {}

    async findByEmail(email: string): Promise<User | null> {
    return this.userRepo.findOne({ where: { email } });
  }
  async createUser(dto: CreateUserDto): Promise<User> {
    const existingUser = await this.userRepo.findOne({ where: { email: dto.email } });
    if (existingUser) throw new BadRequestException('User already exists');

    const organization = await this.orgRepo.findOne({ where: { id: dto.organizationId } });
    if (!organization) throw new BadRequestException('Organization not found');

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const user = this.userRepo.create({
      email: dto.email,
      password: hashedPassword,
      role: dto.role,
      organization,
    });

    return this.userRepo.save(user);
  }
  async getAllUsers(): Promise<User[]> {
    // find() automatically fetch karega saare users
    return this.userRepo.find({
      relations: ['organization'],
      order: { id: 'ASC' },      
    });
  }


  

}
