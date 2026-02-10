import { Injectable } from '@nestjs/common';
// import { CreateOrganizationDto } from './dto/create-organization.dto';
// import { UpdateOrganizationDto } from './dto/update-organization.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Organization } from './entities/organization.entity';

@Injectable()
export class OrganizationService {
  constructor(
    @InjectRepository(Organization)
  private orgRepo: Repository<Organization>,
  ) {}

  async createOrganization(name: string) {
    return this.orgRepo.save({ name });
  }
}
