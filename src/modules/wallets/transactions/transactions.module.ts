import { Transaction } from './transactions.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionsService } from './transactions.service';

@Module({
  providers: [TransactionsService],
  controllers: [],
  imports: [
    TypeOrmModule.forFeature([ Transaction ])
  ],
  exports: [ ]
})
export class TransactionsModule {}
