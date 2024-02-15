import {
  ForbiddenException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { EditIncomeSourceDto, IncomeSourceDto } from './dto';
import { User } from '@prisma/client';

@Injectable()
export class IncomeSourceService {
  constructor(private prisma: PrismaService) {}

  //ROUTE: v1/income-source
  //METHOD: POST
  async createIncomeSource(dto: IncomeSourceDto, user: User) {
    const source = await this.prisma.incomeSource.create({
      data: {
        created_by: user.id,
        name: dto.name,
        description: dto.description,
        source_icon: dto.source_icon,
      },
    });

    return {
      status: 'SUCCESS',
      code: HttpStatus.CREATED,
      message: 'Income source created',
      payload: source,
      errors: null,
    };
  }

  async getAllIncomeSources(user: User) {
    const incomeSources = await this.prisma.incomeSource.findMany({
      where: {
        created_by: user.id,
      },
    });

    if (incomeSources.length <= 0) {
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
    return {
      status: 'SUCCESS',
      code: HttpStatus.OK,
      message: 'Fetched all income sources',
      payload: incomeSources,
      errors: null,
    };
  }

  async getIncomeSourceById(user: User, sourceId: number) {
    const incomeSource = await this.prisma.incomeSource.findUnique({
      where: {
        id: sourceId,
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
    return {
      status: 'SUCCESS',
      code: HttpStatus.OK,
      message: 'Fetched income source',
      payload: incomeSource,
      errors: null,
    };
  }

  async deleteIncomeSourceById(user: User, sourceId: number) {
    const incomeSource = await this.prisma.incomeSource.findUnique({
      where: { id: sourceId, created_by: user.id },
    });

    if (!incomeSource || incomeSource.created_by !== user.id) {
      throw new ForbiddenException({
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

    await this.prisma.incomeSource.delete({
      where: { id: incomeSource.id },
    });
    return {
      status: 'SUCCESS',
      code: HttpStatus.OK,
      message: 'Income source deleted',
      payload: incomeSource,
      errors: null,
    };
  }

  async updateIncomeSourceById(
    user: User,
    sourceId: number,
    dto: EditIncomeSourceDto,
  ) {
    const incomeSource = await this.prisma.incomeSource.findUnique({
      where: { id: sourceId, created_by: user.id },
    });

    if (!incomeSource || incomeSource.created_by !== user.id) {
      throw new ForbiddenException({
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

    const updatedincomeSource = await this.prisma.incomeSource.update({
      where: { id: sourceId },
      data: { ...dto },
    });

    return {
      status: 'SUCCESS',
      code: HttpStatus.OK,
      message: 'Income source updated',
      payload: updatedincomeSource,
      errors: null,
    };
  }
}
