import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { ExpenseDto, UpdateExpenseDto } from './dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from '@prisma/client';

@Injectable()
export class ExpenseService {
  constructor(private prisma: PrismaService) {}

  async createExpense(dto: ExpenseDto, user: User) {
    const expenseCategory = await this.prisma.expenseCategory.findUnique({
      where: {
        id: dto.expense_category_id,
        created_by: user.id,
      },
    });

    if (!expenseCategory) {
      throw new NotFoundException({
        status: 'FAILED',
        code: HttpStatus.NOT_FOUND,
        message: null,
        payload: null,
        errors: [
          {
            title: 'No expense category found!',
            description:
              'No expense category were found for the logged in user. Please add an expense category first',
          },
        ],
      });
    }
    const expense = await this.prisma.expense.create({
      include: {
        expense_category: {
          select: { id: true, name: true, category_icon: true },
        },
      },
      data: {
        title: dto.title,
        amount: dto.amount,
        details: dto.details,
        date: dto.date,
        created_by: user.id,
        expense_category_id: expenseCategory.id,
      },
    });

    return {
      status: 'SUCCESS',
      code: HttpStatus.CREATED,
      message: 'Expense created',
      payload: expense,
      errors: null,
    };
  }

  async getAllExpenses(user: User, page, perPage) {
    const pageNo = parseInt(page);
    const perPageNo = parseInt(perPage);
    const expenses = await this.prisma.expense.findMany({
      take: perPageNo,
      skip: (pageNo - 1) * perPageNo,
      where: { created_by: user.id },
      include: {
        expense_category: {
          select: { id: true, name: true, category_icon: true },
        },
      },
    });
    const count = await this.prisma.expense.count({
      where: { created_by: user.id },
    });
    return {
      status: 'SUCCESS',
      code: HttpStatus.OK,
      message: 'Expense found',
      payload: expenses,
      pagination: {
        page,
        per_page: perPageNo,
        total_items: count,
        total_pages: Math.ceil(count / perPage),
      },
      errors: null,
    };
  }

  async getExpenseById(expenseId: number, user: User) {
    const expense = await this.prisma.expense.findUnique({
      where: { id: expenseId, created_by: user.id },
      include: {
        expense_category: {
          select: { id: true, name: true, category_icon: true },
        },
      },
    });

    if (!expense) {
      throw new NotFoundException({
        status: 'FAILED',
        code: HttpStatus.NOT_FOUND,
        message: null,
        payload: null,
        errors: [
          {
            title: 'No expense found!',
            description:
              'No expense exist for the given id or the expense doesnt belong to the logged in user',
          },
        ],
      });
    }
    return {
      status: 'SUCCESS',
      message: 'Expense found',
      code: HttpStatus.OK,
      payload: expense,
      errors: null,
    };
  }

  async updateExpenseById(
    expenseId: number,
    user: User,
    dto: UpdateExpenseDto,
  ) {
    const expense = await this.prisma.expense.findUnique({
      where: { id: expenseId, created_by: user.id },
    });

    if (!expense) {
      throw new NotFoundException({
        status: 'FAILED',
        code: HttpStatus.NOT_FOUND,
        message: null,
        payload: null,
        errors: [
          {
            title: 'No expense found!',
            description:
              'No expense exist for the given id or the expense doesnt belong to the logged in user',
          },
        ],
      });
    }

    const updatedExpense = await this.prisma.expense.update({
      where: { id: expense.id },
      data: { ...dto },
    });

    return {
      status: 'SUCCESS',
      message: 'Expense Updated',
      code: HttpStatus.OK,
      payload: updatedExpense,
      errors: null,
    };
  }

  async deleteExpenseById(expenseId: number, user: User) {
    const expense = await this.prisma.expense.findUnique({
      where: { id: expenseId, created_by: user.id },
    });

    if (!expense) {
      throw new NotFoundException({
        status: 'FAILED',
        code: HttpStatus.NOT_FOUND,
        message: null,
        payload: null,
        errors: [
          {
            title: 'No expense found!',
            description:
              'No expense exist for the given id or the expense doesnt belong to the logged in user',
          },
        ],
      });
    }

    const deletedExpense = await this.prisma.expense.delete({
      where: { id: expense.id },
    });

    return {
      status: 'SUCCESS',
      message: 'Expense Deleted',
      code: HttpStatus.OK,
      payload: deletedExpense,
      errors: null,
    };

    return 'delete expense by id';
  }
}
