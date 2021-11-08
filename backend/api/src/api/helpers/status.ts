import { Request, Response, NextFunction } from  'express';
const errorCodes = require('../../config/codes');

export = new class Status {
  error = (res: Response, status: number = 500, errors: any = []) => {
    if (typeof errors === 'string') errors = [ errors ];

    let additionalErrors: any[] = [];
    errors.map((error: any) => {
      let [ section, status, ...args ] = error.split('.');

      status = status === '0' ? 400 : parseInt(status);

      try {
        let message = section === 'ce' ? args : errorCodes[section][status](...args);
      
        additionalErrors.push({
          code: status,
          message: message[0],
          detail: message[1]
        })
      } catch(err) {
        additionalErrors.push({
          code: 400,
          message: error,
          detail: ''
        })
      }
    });

    res.status(status).json({
      status,
      message: errorCodes.sc[status]()[0],
      detail: errorCodes.sc[status]()[1],
      additionalErrors
    })
  }

  success = (res: Response) => res.status(200).json({status: 200, message: errorCodes.sc[200][0], detail: errorCodes.sc[200][1]});
}
