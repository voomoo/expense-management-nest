import { Module } from '@nestjs/common';
import { IncomeSourceController } from './income-source.controller';
import { IncomeSourceService } from './income-source.service';

@Module({
  controllers: [IncomeSourceController],
  providers: [IncomeSourceService]
})
export class IncomeSourceModule {}
