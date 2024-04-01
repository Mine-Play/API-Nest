import { Injectable } from '@nestjs/common';
import { Robokassa } from 'robokassa-node';
import type { RobokassaConfig } from 'robokassa-node';

@Injectable()
export class RobokassaService
{
    robokassa = new Robokassa({
        merchantId: process.env.ROBOKASSA_MERCHANT_ID,
        passwordOne: process.env.ROBOKASSA_PASSWORD_1,
        passwordTwo: process.env.ROBOKASSA_PASSWORD_2,
        hashAlgo: 'SHA512',
    });

    async getPaymentLink() {
        
    }
}