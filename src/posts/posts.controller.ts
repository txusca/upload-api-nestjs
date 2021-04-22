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
import { PostsService } from './posts.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { randomBytes } from 'crypto';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/get-user.decorator';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
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
