import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
// import { CreateOrganizationDto } from './dto/create-organization.dto';
// import { UpdateOrganizationDto } from './dto/update-organization.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Organization } from './entities/organization.entity';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';

@Injectable()
export class OrganizationService {
  constructor(
    @InjectRepository(Organization)
  private orgRepo: Repository<Organization>,
  ) {}


    async findAll() {
    return this.orgRepo.find();

    }


  async create(dto: CreateOrganizationDto) {
  const existing = await this.orgRepo.findOne({ where: { name: dto.name } });
  if (existing) throw new BadRequestException('Organization already exists');

  const org = this.orgRepo.create(dto);
  return this.orgRepo.save(org);
}
  

    async findOne(id: number) {
    const org = await this.orgRepo.findOne({ where: { id } });
    if (!org) throw new NotFoundException('Organization not found');
    return org;
  }

  async update(id: number, dto: UpdateOrganizationDto) {
    const org = await this.findOne(id);
    Object.assign(org, dto);
    return this.orgRepo.save(org);
  }


    async delete(id: number) {
    const result = await this.orgRepo.delete(id);
    if (result.affected === 0)
      throw new NotFoundException('Organization not found');

    return { message: 'Organization deleted successfully' };
  }

}
