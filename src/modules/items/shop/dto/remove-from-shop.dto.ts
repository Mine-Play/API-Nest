import { IsNumber } from "class-validator";

export class RemoveFromShopDto {
    @IsNumber(undefined, { message: "Укажите корректный артикул!" })
    id: number;
}