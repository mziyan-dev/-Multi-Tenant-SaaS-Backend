import { Module } from '@nestjs/common';
import { FeaturesService } from './features.service';
import { FeaturesController } from './features.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Feature } from './entities/feature.entity';
import { OrganizationFeature } from './entities/organization-feature.entity';
import { Organization } from 'src/organization/entities/organization.entity';
import { FeatureGuard } from './guards/feature.guard';

@Module({
  imports:[TypeOrmModule.forFeature([Feature,OrganizationFeature,Organization])],
  providers: [FeaturesService,FeatureGuard],
  controllers: [FeaturesController]
})
export class FeaturesModule {}
