import { Module, forwardRef } from '@nestjs/common';
import { WalletsService } from './wallets.service';
import { WalletController } from './wallets.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Wallet } from './wallets.entity';
import { TransactionsModule } from './transactions/transactions.module';
import { RobokassaService } from 'src/services/payments/robokassa.service';
import { UsersModule } from '../users/users.module';
import { OrdersModule } from './orders/orders.module';

@Module({
  providers: [WalletsService, RobokassaService],
  controllers: [WalletController],
  imports: [
    TypeOrmModule.forFeature([ Wallet ]),
    TransactionsModule,
    OrdersModule,
    forwardRef(() => UsersModule)
  ],
  exports: [ WalletsService ]
})
export class WalletsModule {}
