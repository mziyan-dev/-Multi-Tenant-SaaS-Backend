import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { FeaturesService } from './features.service';
import { CreateFeatureDto } from './dto/create-feature.dto';
import { AssignFeatureDto } from './dto/assign-feature.dto';
import { ToggleFeatureDto } from './dto/toggle-feature.dto';

@Controller('features')
export class FeaturesController {
    constructor(private readonly featureService: FeaturesService) { }

    @Get('organization/:orgId')
    listOrgFeatures(@Param('orgId') orgId: number) {
        return this.featureService.listOrgFeatures(orgId);
    }


    @Post('create')
    createFeature(@Body() dto: CreateFeatureDto) {
        return this.featureService.createFeature(dto);
    }


    @Post('assign')
    assignFeature(@Body() dto: AssignFeatureDto) {
        return this.featureService.assignFeature(dto);
    }


    @Patch('toggle')
    toggleFeature(@Body() dto: ToggleFeatureDto) {
        return this.featureService.toggleFeature(dto);
    }
    @Get('all')
    listAllFeatures() {
        return this.featureService.listAllFeatures();


}

}
