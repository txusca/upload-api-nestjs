import { Express } from 'express';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Post, PostDocument } from './entities/post.entity';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class PostsService {
  constructor(
    @InjectModel(Post.name) private readonly postModel: Model<PostDocument>,
  ) {}
  create(file: Express.Multer.File, user: User) {
    const { originalname, size, filename: key, destination: url = '' } = file;

    const createdPost = new this.postModel({
      filename: originalname,
      size,
      key,
      url,
      user,
    });
    return createdPost.save();
  }

  findAll() {
    return this.postModel.find().exec();
  }

  findOne(id: string) {
    return this.postModel.findById(id);
  }

  remove(id: string) {
    return this.postModel.findByIdAndRemove(id);
  }
}
