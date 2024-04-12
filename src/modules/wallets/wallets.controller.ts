import { Body, Controller, Get, HttpStatus, Param, Post, Req, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { RobokassaService } from 'src/services/payments/robokassa.service';
import { AuthGuard, EmailConfirmedGuard } from '../users/auth/auth.guard';
import { UsersService } from '../users/users.service';
import { PaymentMethod, PaymentObject, PaymentTax } from 'robokassa-node';
import { ReplenishWalletDto } from './dto/replenish-wallet.dto';
import { OrdersService } from './orders/orders.service';

@Controller('wallets')
export class WalletController {
    constructor(private robokassaService: RobokassaService,
                private userService: UsersService,
                private ordersService: OrdersService){}

    @UseGuards(AuthGuard, EmailConfirmedGuard)
    @Post('/replenish')
    async getAll(@Req() request, @Res() res: Response, @Body() dto: ReplenishWalletDto) {
        const user = await this.userService.getById(request.user.id, ['email', 'name', 'id']);
        const item = {
            name: `Монеты`,
            quantity: dto.amount,
            sum: `${(Number(process.env.ECONOMY_MONEY_COST) * dto.amount)}.00`,
            tax: PaymentTax.NONE,
            payment_method: PaymentMethod.FULL_PREPAYMENT,
            payment_object: PaymentObject.COMMODITY,
        };
        const order = await this.ordersService.create((Number(process.env.ECONOMY_MONEY_COST) * dto.amount), dto.amount, user);
        const redirectUrl = await this.robokassaService.getPaymentLink((Number(process.env.ECONOMY_MONEY_COST) * dto.amount), order.id, user.email, `Приобретение ${dto.amount} монет на счёт игрока ${user.name}`, item)
        return res.status(HttpStatus.OK).json({ status: HttpStatus.OK, data: { redirectUrl } });
    }
}
