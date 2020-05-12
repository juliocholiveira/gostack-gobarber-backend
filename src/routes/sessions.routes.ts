import { Router } from "express";
import AuthenticateUserService from "../services/AuthenticateUserService";

const router = Router();

router.post('/', async (req, res) => {
  try {
    const { email, password } = req.body;

    const { user, token } = await new AuthenticateUserService().execute({ email, password });

    return res.json({ user, token })
  } catch (error) {
    return res.json({ message: error.message })
  }

});

export default router;
