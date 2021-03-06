import 'reflect-metadata';
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import 'express-async-errors';
import routes from './routes';
import uploadConfig from '@config/upload';

import '@shared/infra/typeorm';
import AppError from '@shared/errors/AppError';

const app = express();

app.use(express.json());

app.use(cors({
  origin: 'http://localhost:3000'
}));

// Servindo arquivos estáticos
app.use('/files', express.static(uploadConfig.directory));

app.use(routes);

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      status: 'error',
      message: err.message,
    });
  }

  return res.status(500).json({
    status: 'error',
    message: 'Internal server error.'
  });
});

app.listen(3333, () => {
  console.log('🚀 Server is running on port 3333...');
});
