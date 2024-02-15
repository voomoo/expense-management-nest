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
import { JwtGuard } from 'src/auth/guard';
import { IncomeSourceService } from './income-source.service';
import { EditIncomeSourceDto, IncomeSourceDto } from './dto';
import { GetUser } from 'src/auth/decorator';
import { User } from '@prisma/client';

@UseGuards(JwtGuard)
@Controller('income-source')
export class IncomeSourceController {
  constructor(private incomeSourceService: IncomeSourceService) {}

  @Post()
  createIncomeSource(@Body() dto: IncomeSourceDto, @GetUser() user) {
    return this.incomeSourceService.createIncomeSource(dto, user);
  }

  @Get()
  getAllIncomeSources(@GetUser() user) {
    return this.incomeSourceService.getAllIncomeSources(user);
  }

  @Get(':id')
  getIncomeSourceById(
    @GetUser() user,
    @Param('id', ParseIntPipe) sourceId: number,
  ) {
    return this.incomeSourceService.getIncomeSourceById(user, sourceId);
  }

  @Delete(':id')
  deleteIncomeSourceById(
    @GetUser() user,
    @Param('id', ParseIntPipe) categoryId: number,
  ) {
    return this.incomeSourceService.deleteIncomeSourceById(user, categoryId);
  }

  @Patch(':id')
  updateIncomeSourceById(
    @Body() dto: EditIncomeSourceDto,
    @Param('id', ParseIntPipe) categoryId: number,
    @GetUser() user: User,
  ) {
    return this.incomeSourceService.updateIncomeSourceById(
      user,
      categoryId,
      dto,
    );
  }
}
