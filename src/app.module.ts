import { Module } from '@nestjs/common';
import { IncomeModule } from './income/income.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { ExpenseModule } from './expense/expense.module';
import { IncomeSourceModule } from './income-source/income-source.module';
import { ExpenseCategoryModule } from './expense-category/expense-category.module';
import { SessionModule } from './session/session.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    IncomeModule,
    AuthModule,
    UserModule,
    ExpenseModule,
    IncomeSourceModule,
    ExpenseCategoryModule,
    SessionModule,
    PrismaModule,
    ConfigModule.forRoot({ isGlobal: true }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
