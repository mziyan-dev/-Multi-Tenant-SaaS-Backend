import { IsNumber, IsOptional } from "class-validator";


export class AssignFeatureDto {

    @IsNumber()
    organizationId: number;

    @IsNumber()
    featureId: number;


    @IsOptional()
    isEnabled?: boolean;
    
}
