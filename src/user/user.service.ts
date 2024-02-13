import { HttpStatus, Injectable } from '@nestjs/common';
import { User } from '@prisma/client';

@Injectable()
export class UserService {
  //ROUTE: v1/user/me
  //METHOD: GET
  getMe(user: User) {
    return {
      status: 'SUCCESS',
      code: HttpStatus.OK,
      message: 'User data fetched successfully',
      payload: user,
      errors: null,
    };
  }
}
