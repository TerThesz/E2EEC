import { Request, Response, NextFunction } from  'express';
import { error } from '../helpers';

export = (schema: any) => async (req: Request, res: Response, next: Function) => {
  const content = req.method.toLocaleLowerCase() === 'post' ? req.body : req.query;

  try {
    await schema.validate(content, { abortEarly: false });
    next();
  } catch (err) {
    if (!err.inner?.length) throw err;

    if (err.inner.length) {
      const additionalErrors = new Array<string>();

      err.inner.forEach((error: any) => {
        additionalErrors.push(`ce.0.${error.name}.${error.message}`);
      });
      
      error(res, 400, additionalErrors);
    }
  }
}
