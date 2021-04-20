import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { User } from 'src/user/entities/user.entity';

export type PostDocument = Post & Document;

@Schema()
export class Post {
  @Prop({ required: true, trim: true })
  filename: string;

  @Prop({ required: true })
  size: number;

  @Prop({ required: false, trim: true })
  key: string;

  @Prop({ required: false, trim: true })
  url: string;

  @Prop({ required: true, default: Date.now() })
  createdAt: Date;

  @Prop({ ref: 'User' })
  user: User;
}

export const PostSchema = SchemaFactory.createForClass(Post);
