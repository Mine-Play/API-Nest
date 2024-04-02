import { IsNotEmpty, IsNumber, Max, Min, MinLength } from "class-validator";

export class AddItemToShopDto {
    @IsNumber(null, { message: "Укажите корректный артикул!" })
    id: string;

    @Min(0, { message: "Кол-во монет не может быть меньше 0!" })
    readonly money: number;

    @Min(0, { message: "Минимальная скидка - 0%!" })
    @Max(100, { message: "Максимальная скидка - 100%!" })
    readonly moneySale: number;

    @Min(0, { message: "Кол-во коинов не может быть меньше 0!" })
    readonly coins: number;

    @Min(0, { message: "Минимальная скидка - 0%!" })
    @Max(100, { message: "Максимальная скидка - 100%!" })
    readonly coinsSale: number;

    @Min(0, { message: "Кол-во ключей не может быть меньше 0!" })
    readonly keys: number;

    @Min(0, { message: "Минимальная скидка - 0%!" })
    @Max(100, { message: "Максимальная скидка - 100%!" })
    readonly keysSale: number;

    @Min(1, { message: "Минимальный лимит - 1 ед.!" })
    readonly limit: number;
}