import { IsEmail, IsNotEmpty } from 'class-validator';

export class CredentialsDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;
}
