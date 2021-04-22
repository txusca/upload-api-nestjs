import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { genSaltSync, hash } from 'bcrypt';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ unique: true, required: true, trim: true })
  email: string;

  @Prop({ required: true })
  password: string;

  async checkPassword(password: string): Promise<boolean> {
    const salt = await genSaltSync(15);
    const passwordHash = await hash(this.password, salt);

    return passwordHash === this.password;
  }
}

export const UserSchema = SchemaFactory.createForClass(User);
