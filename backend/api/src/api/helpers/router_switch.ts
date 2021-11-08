import { Request, Response, NextFunction } from  'express';
import { validationMiddleware } from '../middlewares';
import { error } from '../helpers';

export = (controller: { [key: string]: Function }, validation: { [key: string]: object }, ...middleware: [ Function ] | []) =>
  async (req: Request, res: Response, next: NextFunction) => {
    const method = req.method.toLocaleLowerCase();
    
    if (!controller) return error(res, 405);

    if (validation && validation[method]) validationMiddleware(validation[method])(req, res, () => callController());
    else callController();

    function callController() {
      let nextFunction = true;

      middleware.forEach(mw => {
        if (nextFunction) mw(req, res, () => nextFunction = false);
      });

      if (nextFunction) controller[method](req, res, next);
    }
}
