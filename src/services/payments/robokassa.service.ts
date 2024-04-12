import { Injectable } from '@nestjs/common';
import { Order, Robokassa } from 'robokassa-node';

@Injectable()
export class RobokassaService
{
    robokassa = new Robokassa({
        merchantId: process.env.ROBOKASSA_MERCHANT_ID,
        passwordOne: process.env.ROBOKASSA_PASSWORD_1,
        passwordTwo: process.env.ROBOKASSA_PASSWORD_2,
        isTest: true,
        hashAlgo: 'SHA512',
    });

    async getPaymentLink(amount: number, orderId: string, email: string, description: string, item){
        const order: Order = {
            outSum: amount,
            additionalParams: { orderId },
            description,
            email,
            items: [ item ],
        };

        return await this.robokassa.generatePaymentLink(order);
    }
}