import { IsOptional, Min } from "class-validator";

export class ReplenishWalletDto {
    @Min(1, { message: "Минимальное количество монет для пополнения - 1" })
    readonly amount: number;

    @IsOptional()
    readonly userId: string;
}