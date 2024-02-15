import { IsAlphanumeric, IsEmail, MaxLength, MinLength } from "class-validator";

export class RegisterUserDto {
    @MinLength(3)
    @MaxLength(15)
    @IsAlphanumeric()
    readonly name: string;

    @IsEmail()
    readonly email: string;
    
    @MinLength(8)
    readonly password: string;
}