import {
  ForbiddenException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { EditExpenseCategoryDto, ExpenseCategoryDto } from './dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from '@prisma/client';

@Injectable()
export class ExpenseCategoryService {
  constructor(private prisma: PrismaService) {}
  //ROUTE: v1/expense-category
  //METHOD: POST
  async createExpenseCategory(dto: ExpenseCategoryDto, user: User) {
    const category = await this.prisma.expenseCategory.create({
      data: {
        created_by: user.id,
        name: dto.name,
        description: dto.description,
        category_icon: dto.category_icon,
      },
    });

    return {
      status: 'SUCCESS',
      code: HttpStatus.CREATED,
      message: 'Expense category created',
      payload: category,
      errors: null,
    };
  }

  async getAllExpenseCategories(user: User) {
    const expenseCategories = await this.prisma.expenseCategory.findMany({
      where: {
        created_by: user.id,
      },
    });

    if (expenseCategories.length <= 0) {
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
    return {
      status: 'SUCCESS',
      code: HttpStatus.OK,
      message: 'Fetched all expense categories',
      payload: expenseCategories,
      errors: null,
    };
  }

  async getExpenseCategoryById(user: User, categoryId: number) {
    const expenseCategory = await this.prisma.expenseCategory.findUnique({
      where: {
        id: categoryId,
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
    return {
      status: 'SUCCESS',
      code: HttpStatus.OK,
      message: 'Fetched expense category',
      payload: expenseCategory,
      errors: null,
    };
  }

  async deleteExpenseCategoryById(user: User, categoryId: number) {
    const expenseCategory = await this.prisma.expenseCategory.findUnique({
      where: { id: categoryId, created_by: user.id },
    });

    if (!expenseCategory || expenseCategory.created_by !== user.id) {
      throw new ForbiddenException({
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

    await this.prisma.expenseCategory.delete({
      where: { id: expenseCategory.id },
    });
    return {
      status: 'SUCCESS',
      code: HttpStatus.OK,
      message: 'Expense category deleted',
      payload: expenseCategory,
      errors: null,
    };
  }

  async updateExpenseCategoryById(
    user: User,
    categoryId: number,
    dto: EditExpenseCategoryDto,
  ) {
    const expenseCategory = await this.prisma.expenseCategory.findUnique({
      where: { id: categoryId, created_by: user.id },
    });

    if (!expenseCategory || expenseCategory.created_by !== user.id) {
      throw new ForbiddenException({
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

    const updatedExpenseCategory = await this.prisma.expenseCategory.update({
      where: { id: categoryId },
      data: { ...dto },
    });

    return {
      status: 'SUCCESS',
      code: HttpStatus.OK,
      message: 'Expense category updated',
      payload: updatedExpenseCategory,
      errors: null,
    };
  }
}
