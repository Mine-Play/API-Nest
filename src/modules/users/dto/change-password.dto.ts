import { IsNotEmpty } from "class-validator";

export class ChangePasswordDto {
    @IsNotEmpty()
    readonly password: string;
    
    @IsNotEmpty()
    readonly newPassword: string;
}