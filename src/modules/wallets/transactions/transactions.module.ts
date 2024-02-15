import { Transaction } from './transactions.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  providers: [],
  controllers: [],
  imports: [
    TypeOrmModule.forFeature([ Transaction ]),
  ],
  exports: [ ]
})
export class TransactionsModule {}
