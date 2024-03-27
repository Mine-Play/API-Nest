import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';


@Module({
  controllers: [],
  providers: [],
  exports: [],
  imports: [
    TypeOrmModule.forFeature([])
  ]
})
export class ConfirmationsModule {}
