import { Module } from '@nestjs/common';
import { WalletsService } from './wallets.service';
import { WalletController } from './wallets.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Wallet } from './wallets.entity';
import { TransactionsModule } from './transactions/transactions.module';

@Module({
  providers: [WalletsService],
  controllers: [WalletController],
  imports: [
    TypeOrmModule.forFeature([ Wallet ]),
    TransactionsModule
  ],
  exports: [ WalletsService ]
})
export class WalletsModule {}
