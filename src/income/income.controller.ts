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
import { IncomeService } from './income.service';
import { JwtGuard } from 'src/auth/guard';
import { IncomeDto, UpdateIncomeDto } from './dto';
import { GetUser } from 'src/auth/decorator';
import { User } from '@prisma/client';

@UseGuards(JwtGuard)
@Controller('income')
export class IncomeController {
  constructor(private income: IncomeService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createIncome(@Body() dto: IncomeDto, @GetUser() user: User) {
    return this.income.createIncome(dto, user);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async getAllIncomes(
    @GetUser() user: User,
    @Query('page') page = 1,
    @Query('per_page') perPage = 10,
  ) {
    return this.income.getAllIncomes(user, page, perPage);
  }

  @Get(':id')
  async getIncomeById(
    @Param('id', ParseIntPipe) incomeId: number,
    @GetUser() user,
  ) {
    return this.income.getIncomeById(incomeId, user);
  }

  @Patch(':id')
  async updateIncomeById(
    @Body() dto: UpdateIncomeDto,
    @Param('id', ParseIntPipe) incomeId,
    @GetUser() user,
  ) {
    return this.income.updateIncomeById(incomeId, user, dto);
  }

  @Delete(':id')
  async deleteIncomeById(@Param('id', ParseIntPipe) incomeId, @GetUser() user) {
    return this.income.deleteIncomeById(incomeId, user);
  }
}
