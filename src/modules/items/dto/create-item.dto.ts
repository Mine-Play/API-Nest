import { IsNotEmpty, MinLength } from "class-validator";

export class CreateItemDto {
    @MinLength(1, { message: 'Укажите название предмета!' })
    readonly name: string;

    @IsNotEmpty({ message: 'Укажите тип предмета!' })
    readonly type: "PERSONALIZE" | "SERVICE" | "STATUS" | "PERK" | "KIT";
}