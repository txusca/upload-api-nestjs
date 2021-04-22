import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { genSaltSync, hash, compare } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { User, UserDocument } from 'src/user/entities/user.entity';
import { CredentialsDto } from './dto/credentials.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    private jwtService: JwtService,
  ) {}

  async signUp(createUserDto: CreateUserDto): Promise<User> {
    const createdUser = new this.userModel(createUserDto);
    createdUser.password = await this.hashPassword(createdUser.password);
    return createdUser.save();
  }

  async signIn(credentialsDto: CredentialsDto) {
    const user = await this.userModel.findOne({ email: credentialsDto.email });
    if (user == null) return new Error('Email não encontrado!');

    credentialsDto.password = await this.hashPassword(credentialsDto.password);
    if (!compare(user.password, credentialsDto.password)) {
      throw new Error('As senhas não batem!');
    }

    const jwtPayload = {
      id: user._id,
    };

    const token = await this.jwtService.sign(jwtPayload);

    return { token };
  }

  async hashPassword(password: string) {
    const salt = await genSaltSync(10);
    const passwordHash = await hash(password, salt);

    return await passwordHash;
  }
}
