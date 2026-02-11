import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";
import { FeaturesService } from "../features.service";
import { Reflector } from "@nestjs/core";




@Injectable()
export class FeatureGuard implements CanActivate {
    constructor(private readonly featuresService: FeaturesService, private reflector: Reflector){}


      async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredFeature = this.reflector.get<string>('feature', context.getHandler());
    if (!requiredFeature) return true;

    const request = context.switchToHttp().getRequest();
    const orgId = request.user.organizationId; 
    const orgFeatures = await this.featuresService.listOrgFeatures(orgId);

    const feature = orgFeatures.find((f) => f.feature.name === requiredFeature && f.isEnabled);
    if (!feature) throw new ForbiddenException('Feature not enabled for your organization');

    return true;
  }

}
