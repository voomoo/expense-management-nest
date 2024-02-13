import {
  ConflictException,
  ForbiddenException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Response, SigninDto, SignupDto } from './dto';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  async signup(dto: SignupDto) {
    try {
      // generate the password hash
      const hash = await argon.hash(dto.password);

      // save the new user in the DB
      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          hash,
          name: dto.name,
          avatar: dto.avatar,
        },
      });

      // delete hash before the response
      delete user.hash;

      // return the user
      return this.signToken(user.id, user.email);
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ConflictException({
            status: 'FAILED',
            code: HttpStatus.CONFLICT,
            message: null,
            payload: null,
            errors: [
              {
                title: 'Credentials taken',
                description:
                  'Another user with the same email is already signed up, please try again with another email',
              },
            ],
          });
        }
      }
      throw error;
    }
  }

  async signin(dto: SigninDto) {
    // find the user by email
    const user = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });

    //if no user found throw error
    if (!user) {
      throw new ForbiddenException({
        status: 'FAILED',
        code: HttpStatus.FORBIDDEN,
        message: null,
        payload: null,
        errors: [
          {
            title: 'Credentials wrong',
            description: 'Provided email or password is incorrect',
          },
        ],
      });
    }

    //compare passwords
    const passwordMatches = await argon.verify(user.hash, dto.password);

    //if incorrect password throw error
    if (!passwordMatches) {
      throw new ForbiddenException({
        status: 'FAILED',
        payload: null,
        code: HttpStatus.FORBIDDEN,
        message: null,
        errors: [
          {
            title: 'Credentials wrong',
            description: 'Provided email or password is incorrect',
          },
        ],
      });
    }

    delete user.hash;

    return await this.signToken(user.id, user.email);
  }

  //token signing function
  async signToken(userId: number, email: string): Promise<Response> {
    const payload = { sub: userId, email };
    const secret = this.config.get('JWT_SECRET');
    return {
      status: 'SUCCESS',
      code: HttpStatus.OK,
      message: 'Successful authentication',
      payload: {
        access_token: await this.jwt.signAsync(payload, {
          expiresIn: '60m',
          secret,
        }),
      },
      errors: null,
    };
  }
}
