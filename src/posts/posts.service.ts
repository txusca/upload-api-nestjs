import { Express } from 'express';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Post, PostDocument } from './entities/post.entity';
import { Model } from 'mongoose';

@Injectable()
export class PostsService {
  constructor(
    @InjectModel(Post.name) private readonly postModel: Model<PostDocument>,
  ) {}
  create(file: Express.Multer.File) {
    const { originalname, size, filename: key, destination: url = '' } = file;

    const createdPost = new this.postModel({
      filename: originalname,
      size,
      key,
      url,
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
