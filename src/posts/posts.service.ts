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

  async remove(id: string) {
    try {
      const post = await this.postModel.findById(id).exec();
      const params = {
        Bucket: 'upload-api-tx',
        Key: (await post).key,
      };
      await s3.headObject(params).promise();
      console.log('Objeto encontrado!');
      try {
        await s3.deleteObject(params).promise();
        (await post).delete();
        return { message: 'Postagem deletada com sucesso!' };
      } catch (err) {
        return { message: `Erro ao deletar o Objeto ${JSON.stringify(err)}` };
      }
    } catch (err) {
      return { message: `Arquivo não encontrado ${err.code}` };
    }
  }
}
