import User from "../models/User";
import { getRepository } from "typeorm";
import { compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

interface Request {
  email: string;
  password: string;
}

class AuthenticateUserService {
  public async execute({ email, password }: Request): Promise<{ user: User, token: string }> {

    const user = await getRepository(User).findOne({
      where: { email }
    });

    if (!user) {
      throw new Error('Incorrect email/password.');
    }

    const passwordMatched = await compare(password, user.password);

    if (!passwordMatched) {
      throw new Error('Incorrect email/password.');
    }

    delete user.password;

    const secret = process.env.JWT_SECRET as string;
    const expiredIn = process.env.JWT_EXPIRED_IN as string;

    const token = sign({}, secret, {
      subject: user.id,
      expiresIn: expiredIn
    })

    return { user, token };
  }
}

export default AuthenticateUserService;
