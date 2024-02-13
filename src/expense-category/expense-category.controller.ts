import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { EditExpenseCategoryDto, ExpenseCategoryDto } from './dto';
import { ExpenseCategoryService } from './expense-category.service';
import { GetUser } from 'src/auth/decorator';
import { JwtGuard } from 'src/auth/guard';
import { User } from '@prisma/client';

@UseGuards(JwtGuard)
@Controller('expense-category')
export class ExpenseCategoryController {
  constructor(private expenseCategoryService: ExpenseCategoryService) {}

  @Post()
  createExpenseCategory(@Body() dto: ExpenseCategoryDto, @GetUser() user) {
    return this.expenseCategoryService.createExpenseCategory(dto, user);
  }

  @Get()
  getAllExpenseCategories(@GetUser() user) {
    return this.expenseCategoryService.getAllExpenseCategories(user);
  }

  @Get(':id')
  getExpenseCategoryById(
    @GetUser() user,
    @Param('id', ParseIntPipe) categoryId: number,
  ) {
    return this.expenseCategoryService.getExpenseCategoryById(user, categoryId);
  }

  @Delete(':id')
  deleteExpenseCategoryById(
    @GetUser() user,
    @Param('id', ParseIntPipe) categoryId: number,
  ) {
    return this.expenseCategoryService.deleteExpenseCategoryById(
      user,
      categoryId,
    );
  }

  @Patch(':id')
  updateExpenseCategoryById(
    @Body() dto: EditExpenseCategoryDto,
    @Param('id', ParseIntPipe) categoryId: number,
    @GetUser() user: User,
  ) {
    return this.expenseCategoryService.updateExpenseCategoryById(
      user,
      categoryId,
      dto,
    );
  }
}
