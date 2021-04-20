import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserDocument } from './entities/user.entity';

import { genSaltSync, hash } from 'bcrypt';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}
  async create(createUserDto: CreateUserDto) {
    const createdUser = new this.userModel(createUserDto);
    const salt = await genSaltSync(10);
    const passwordHash = await hash(createdUser.password, salt);
    createdUser.password = passwordHash;
    return createdUser.save();
  }

  findAll(): Promise<UserDocument[]> {
    return this.userModel.find().exec();
  }

  findOne(_id: string) {
    return this.userModel.findOne({ _id }).exec();
  }

  async update(_id: string, updateUserDto: UpdateUserDto) {
    const userUpdated = await this.userModel.findByIdAndUpdate(_id, {
      name: updateUserDto.name,
      email: updateUserDto.email,
    });

    return this.findOne(_id);
  }

  async remove(_id: string) {
    await this.userModel.findByIdAndDelete(_id);
    return `Dado removido com sucesso!`;
  }
}
