import { Request, Response, NextFunction, response } from 'express';
import { verify } from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

interface TokenPayLoad {
  iat: number;
  exp: number;
  sub: string;
}

export default function ensureAuthenticated(req: Request, res: Response, next: NextFunction): void{
  const auth = req.headers.authorization;

  if (!auth) {
    throw new Error('Token JWT is missing');
  }

  const [, token] = auth.split(' ');
  const secret = process.env.JWT_SECRET as string;

  try {
    const decoded = verify(token, secret);

    const { sub } = decoded as TokenPayLoad;

    req.user = {
      id: sub,
    }

    return next();
  } catch {
    throw new Error('Invalid JWT Token');
  }


}
