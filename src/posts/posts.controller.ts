import {
  Controller,
  Get,
  Post,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  UseGuards,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
// Para o discStorage
// import multer, { diskStorage } from 'multer';
import { randomBytes } from 'crypto';
import { AuthGuard } from '@nestjs/passport';
import * as AWS from 'aws-sdk';
import * as multerS3 from 'multer-s3';

import { PostsService } from './posts.service';
import { GetUser } from 'src/auth/get-user.decorator';

const AWS_S3_BUCKET_NAME = process.env.AWS__S3_BUCKET_NAME;
const s3 = new AWS.S3();
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_DEFAULT_REGION,
});

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()

  // Local
  // @UseInterceptors(
  //   FileInterceptor('file', {
  //     storage: diskStorage({
  //       destination: './uploads',
  //       filename: (req, file, cb) => {
  //         randomBytes(16, (err, hash) => {
  //           if (err) cb(err, null);
  //           file.filename = `${hash.toString('hex')}-${file.originalname}`;

  //           cb(null, file.filename);
  //         });
  //       },
  //     }),
  //   }),
  // )

  // S3
  @UseInterceptors(
    FileInterceptor('file', {
      storage: multerS3({
        s3: s3,
        bucket: 'upload-api-tx',
        acl: 'public-read',
        key: (req, file, cb) => {
          randomBytes(16, (err, hash) => {
            if (err) cb(err, null);
            file.filename = `${hash.toString('hex')}-${file.originalname}`;

            cb(null, file.filename);
          });
        },
      }),
    }),
  )
  @UseGuards(AuthGuard())
  create(@UploadedFile() file: Express.Multer.File, @GetUser() user) {
    return this.postsService.create(file, user);
  }

  @UseGuards(AuthGuard())
  @Get()
  findAll() {
    return this.postsService.findAll();
  }

  @UseGuards(AuthGuard())
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.postsService.findOne(id);
  }

  @UseGuards(AuthGuard())
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.postsService.remove(id);
  }
}
