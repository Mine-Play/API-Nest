import { IsNotEmpty, MaxLength } from "class-validator";
import { HasMimeType, IsFile } from "nestjs-form-data";

export class UploadSkinDto {
    @IsNotEmpty()
    readonly title: string;

    @IsNotEmpty()
    readonly description: string;
    
    @MaxLength(2)
    readonly slug: string;
    
    @IsFile()
    @HasMimeType(['image/jpeg', 'image/png'])
    readonly skin: any;
}