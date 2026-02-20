import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Feature } from './entities/feature.entity';
import { Repository } from 'typeorm';
import { OrganizationFeature } from './entities/organization-feature.entity';
import { Organization } from 'src/organization/entities/organization.entity';
import { CreateFeatureDto } from './dto/create-feature.dto';
import { AssignFeatureDto } from './dto/assign-feature.dto';
import { ToggleFeatureDto } from './dto/toggle-feature.dto';

@Injectable()
export class FeaturesService {
    constructor(
        @InjectRepository(Feature)
        private readonly featurerepo: Repository<Feature>,
        @InjectRepository(OrganizationFeature)
        private readonly orgFeatureRepo: Repository<OrganizationFeature>,
        @InjectRepository(Organization)
        private readonly orgRepo: Repository<Organization>,
    ) { }

    async createFeature(dto: CreateFeatureDto) {
        const feature = this.featurerepo.create(dto);
        return this.featurerepo.save(feature);
    }


    async assignFeature(dto: AssignFeatureDto) {
        const org = await this.orgRepo.findOne({ where: { id: dto.organizationId } });
        if (!org) throw new NotFoundException('Organization not found');

        const feature = await this.featurerepo.findOne({ where: { id: dto.featureId } });
        if (!feature) throw new NotFoundException('Feature not found');

        const orgFeature = this.orgFeatureRepo.create({
            organization: org,
            feature,
            isEnabled: dto.isEnabled ?? true,
        });

        return this.orgFeatureRepo.save(orgFeature);
    }

    async toggleFeature(dto: ToggleFeatureDto) {
        const orgFeature = await this.orgFeatureRepo.findOne({
            where: { organization: { id: dto.organizationId }, feature: { id: dto.featureId } },
            relations: ['organization', 'feature'],
        });

        if (!orgFeature) throw new NotFoundException('Feature not assigned to organization');

        orgFeature.isEnabled = dto.isEnabled;
        return this.orgFeatureRepo.save(orgFeature);
    }
    async listOrgFeatures(organizationId: number) {
        return this.orgFeatureRepo.find({
            where: { organization: { id: organizationId } },
            relations: ['feature'],
        });
    }

    async listAllFeatures() {
        return this.featurerepo.find();

}

}
