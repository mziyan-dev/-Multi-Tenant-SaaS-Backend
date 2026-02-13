import { IsNumber, IsOptional } from "class-validator";

export class ToggleFeatureDto {

    @IsNumber()
    organizationId: number;

    @IsNumber()
    featureId: number;

    @IsOptional()
    isEnabled: boolean;
}
