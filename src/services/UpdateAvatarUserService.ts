import { getRepository } from 'typeorm';
import path from 'path';
import fs from 'fs';

import AppError from '../errors/AppError';

import User from '../models/User';
import uploadConfig from '../config/upload';

interface Request {
  userId: string;
  avatarFileName: string;
}

class UpdateAvatarUserService {

  public async execute({userId, avatarFileName}: Request) : Promise<User> {

    const userRepository = getRepository(User);
    const user = await userRepository.findOne(userId);

    if (!user){
      throw new AppError('User not found');
    }

    if (user.avatar) {
      // Remover avatar
      const userAvatarFilePath = path.join(uploadConfig.directory, user.avatar);

      const userAvatarFileExists = await fs.promises.stat(userAvatarFilePath);

      if (userAvatarFileExists) {
        await fs.promises.unlink(userAvatarFilePath);
      }

    }

    user.avatar = avatarFileName;

    await userRepository.save(user);

    delete user.password;

    return user;
  }
}

export default UpdateAvatarUserService;
