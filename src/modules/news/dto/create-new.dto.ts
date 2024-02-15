import { IsAlphanumeric, IsEmail, IsNotEmpty, IsUUID, MaxLength, MinLength } from "class-validator";

export class CreateNewDto {
    @IsNotEmpty()
    readonly name: string;

    @IsNotEmpty()
    readonly shortStory: string;
    
    @IsNotEmpty()
    readonly fullStory: string;
    
    @IsUUID()
    readonly category: string;
}