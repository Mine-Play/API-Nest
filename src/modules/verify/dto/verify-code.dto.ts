import { IsNotEmpty, Max, Min } from "class-validator";

export class VerifyCodeDto {
    @IsNotEmpty()
    @Min(100000)
    @Max(999999)
    readonly code: number;
}