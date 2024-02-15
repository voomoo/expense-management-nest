import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { IncomeDto, UpdateIncomeDto } from './dto';
import { User } from '@prisma/client';

@Injectable()
export class IncomeService {
  constructor(private prisma: PrismaService) {}

  async createIncome(dto: IncomeDto, user: User) {
    const incomeSource = await this.prisma.incomeSource.findUnique({
      where: {
        id: dto.income_source_id,
        created_by: user.id,
      },
    });

    if (!incomeSource) {
      throw new NotFoundException({
        status: 'FAILED',
        code: HttpStatus.NOT_FOUND,
        message: null,
        payload: null,
        errors: [
          {
            title: 'No income source found!',
            description:
              'No income source were found for the logged in user. Please add an income source first',
          },
        ],
      });
    }
    const income = await this.prisma.income.create({
      include: {
        income_source: {
          select: { id: true, name: true, source_icon: true },
        },
      },
      data: {
        title: dto.title,
        amount: dto.amount,
        details: dto.details,
        date: dto.date,
        created_by: user.id,
        income_source_id: incomeSource.id,
      },
    });

    return {
      status: 'SUCCESS',
      code: HttpStatus.CREATED,
      message: 'Income created',
      payload: income,
      errors: null,
    };
  }

  async getAllIncomes(user: User, page, perPage) {
    const pageNo = parseInt(page);
    const perPageNo = parseInt(perPage);
    const incomes = await this.prisma.income.findMany({
      take: perPageNo,
      skip: (pageNo - 1) * perPageNo,
      where: { created_by: user.id },
      include: {
        income_source: {
          select: { id: true, name: true, source_icon: true },
        },
      },
    });
    const count = await this.prisma.income.count({
      where: { created_by: user.id },
    });
    return {
      status: 'SUCCESS',
      code: HttpStatus.OK,
      message: 'Income found',
      payload: incomes,
      pagination: {
        page,
        per_page: perPageNo,
        total_items: count,
        total_pages: Math.ceil(count / perPage),
      },
      errors: null,
    };
  }

  async getIncomeById(incomeId: number, user: User) {
    const income = await this.prisma.income.findUnique({
      where: { id: incomeId, created_by: user.id },
      include: {
        income_source: {
          select: { id: true, name: true, source_icon: true },
        },
      },
    });

    if (!income) {
      throw new NotFoundException({
        status: 'FAILED',
        code: HttpStatus.NOT_FOUND,
        message: null,
        payload: null,
        errors: [
          {
            title: 'No income found!',
            description:
              'No income exist for the given id or the income doesnt belong to the logged in user',
          },
        ],
      });
    }
    return {
      status: 'SUCCESS',
      message: 'Income found',
      code: HttpStatus.OK,
      payload: income,
      errors: null,
    };
  }

  async updateIncomeById(incomeId: number, user: User, dto: UpdateIncomeDto) {
    const income = await this.prisma.income.findUnique({
      where: { id: incomeId, created_by: user.id },
    });

    if (!income) {
      throw new NotFoundException({
        status: 'FAILED',
        code: HttpStatus.NOT_FOUND,
        message: null,
        payload: null,
        errors: [
          {
            title: 'No income found!',
            description:
              'No income exist for the given id or the income doesnt belong to the logged in user',
          },
        ],
      });
    }

    const updatedIncome = await this.prisma.income.update({
      where: { id: income.id },
      data: { ...dto },
    });

    return {
      status: 'SUCCESS',
      message: 'Income Updated',
      code: HttpStatus.OK,
      payload: updatedIncome,
      errors: null,
    };
  }

  async deleteIncomeById(incomeId: number, user: User) {
    const income = await this.prisma.income.findUnique({
      where: { id: incomeId, created_by: user.id },
    });

    if (!income) {
      throw new NotFoundException({
        status: 'FAILED',
        code: HttpStatus.NOT_FOUND,
        message: null,
        payload: null,
        errors: [
          {
            title: 'No income found!',
            description:
              'No income exist for the given id or the income doesnt belong to the logged in user',
          },
        ],
      });
    }

    const deletedIncome = await this.prisma.income.delete({
      where: { id: income.id },
    });

    return {
      status: 'SUCCESS',
      message: 'Income Deleted',
      code: HttpStatus.OK,
      payload: deletedIncome,
      errors: null,
    };
  }
}
