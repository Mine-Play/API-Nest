import { IsAlphanumeric, IsHexColor, IsNotEmpty } from "class-validator";

export class CreateRoleDto {
    @IsNotEmpty()
    readonly name: string;
    
    @IsNotEmpty()
    @IsAlphanumeric()
    readonly slug: string;

    @IsNotEmpty()
    readonly permissions: string;

    @IsHexColor()
    readonly hexColor: string;
}