import { Router } from 'express';
import { getRepository } from 'typeorm';
import multer from 'multer';

import CreateUserService from '../services/CreateUserService';
import UpdateAvatarUserService from '../services/UpdateAvatarUserService';
import User from '../models/User';
import ensureAuthenticated from '../middlewares/ensureAuthenticated';
import uploadConfig from '../config/upload';

const router = Router();
const upload = multer(uploadConfig);

router.post('/', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const user = await new CreateUserService().execute({
      name, email, password
    });

    return res.json(user);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

router.get('/:email', ensureAuthenticated, async (req, res) => {

  const { email } = req.params;

  console.log(email);

  const userRepository = getRepository(User);

  const user = await userRepository.findOne({
    where: { email }
  });

  return res.json(user);
});

router.patch('/avatar', ensureAuthenticated, upload.single('avatar'), async (req, res) => {
  const updateAvatarUserService = new UpdateAvatarUserService();

  const user = await updateAvatarUserService.execute({
    userId: req.user.id,
    avatarFileName: req.file.filename
  });

  return res.json(user);
});

export default router;
