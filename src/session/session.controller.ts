import {
  Controller,
  HttpException,
  HttpStatus,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

@Controller('session')
export class SessionController {
  @Post('file-upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const filename = `${Date.now()}-${file.originalname}`;
          cb(null, filename);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (!file.mimetype.startsWith('image')) {
          return cb(
            new HttpException(
              'Only image files are allowed!',
              HttpStatus.BAD_REQUEST,
            ),
            false,
          );
        }
        cb(null, true);
      },
      limits: {
        fileSize: 128 * 1024, // limit filesize to 128kb
      },
    }),
  )
  async fileUploadTest() {
    return 'file upload test success!';
  }
}
