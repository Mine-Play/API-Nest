import { IsNotEmpty, IsNumber, IsOptional, Max, Min, MinLength } from "class-validator";
import { Item } from "../../items.entity";

export class AddItemToShopDto {
    @IsNumber(undefined, { message: "Укажите корректный артикул!" })
    id: number;

    @IsOptional()
    @Min(0, { message: "Кол-во монет не может быть меньше 0!" })
    readonly money: number;

    @IsOptional()
    @Min(0, { message: "Минимальная скидка - 0%!" })
    @Max(100, { message: "Максимальная скидка - 100%!" })
    readonly moneySale: number;

    @IsOptional()
    @Min(0, { message: "Кол-во коинов не может быть меньше 0!" })
    readonly coins: number;

    @IsOptional()
    @Min(0, { message: "Минимальная скидка - 0%!" })
    @Max(100, { message: "Максимальная скидка - 100%!" })
    readonly coinsSale: number;

    @IsOptional()
    @Min(0, { message: "Кол-во ключей не может быть меньше 0!" })
    readonly keys: number;

    @IsOptional()
    @Min(0, { message: "Минимальная скидка - 0%!" })
    @Max(100, { message: "Максимальная скидка - 100%!" })
    readonly keysSale: number;

    @IsOptional()
    @Min(1, { message: "Минимальный лимит - 1 ед.!" })
    readonly limit: number;
}