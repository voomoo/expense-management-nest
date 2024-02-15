import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtGuard } from 'src/auth/guard';
import { ExpenseService } from './expense.service';
import { ExpenseDto, UpdateExpenseDto } from './dto';
import { GetUser } from 'src/auth/decorator';
import { User } from '@prisma/client';

@UseGuards(JwtGuard)
@Controller('expense')
export class ExpenseController {
  constructor(private expense: ExpenseService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createExpense(@Body() dto: ExpenseDto, @GetUser() user: User) {
    return this.expense.createExpense(dto, user);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async getAllExpenses(
    @GetUser() user: User,
    @Query('page') page = 1,
    @Query('per_page') perPage = 10,
  ) {
    return this.expense.getAllExpenses(user, page, perPage);
  }

  @Get(':id')
  async getExpenseById(
    @Param('id', ParseIntPipe) expenseId: number,
    @GetUser() user,
  ) {
    return this.expense.getExpenseById(expenseId, user);
  }

  @Patch(':id')
  async updateExpenseById(
    @Body() dto: UpdateExpenseDto,
    @Param('id', ParseIntPipe) expenseId,
    @GetUser() user,
  ) {
    return this.expense.updateExpenseById(expenseId, user, dto);
  }

  @Delete(':id')
  async deleteExpenseById(
    @Param('id', ParseIntPipe) expenseId,
    @GetUser() user,
  ) {
    return this.expense.deleteExpenseById(expenseId, user);
  }
}
