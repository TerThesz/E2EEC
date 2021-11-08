import { Request, Response, NextFunction } from 'express';

export = async (req: Request, res: Response, next: NextFunction) => {
  res.send('Hello World!');
}