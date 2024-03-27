import { IsNotEmpty, IsNumber, IsUUID } from "class-validator";

export class CreateNewDto {
    @IsNotEmpty()
    readonly name: string;

    @IsNotEmpty()
    readonly shortStory: string;
    
    @IsNotEmpty()
    readonly fullStory: string;

    @IsNotEmpty()
    @IsNumber()
    readonly time: number;
    
    @IsUUID()
    readonly category: string;
}