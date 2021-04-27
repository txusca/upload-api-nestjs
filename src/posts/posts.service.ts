import { Express } from 'express';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as AWS from 'aws-sdk';
import * as multerS3 from 'multer-s3';

import { Post, PostDocument } from './entities/post.entity';
import { User } from 'src/user/entities/user.entity';

const s3 = new AWS.S3();
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_DEFAULT_REGION,
});

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
    const post = this.postModel.findById(id);

    if (post == null) throw new Error('Errorrrrrr');

    post.exec().then((post) => {
      s3.deleteObject(
        {
          Bucket: 'upload-api-tx',
          Key: post.key,
        },
        (err, data) => {
          if (err) return err;
          else {
            post.delete();
            return null;
          }
        },
      );
    });
  }
}
