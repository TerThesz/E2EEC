var router = new (require('express')).Router;

import { userValidation } from '../validations';
import { validationMiddleware } from '../middlewares';
import { userController } from '../controllers';

router.all('/', validationMiddleware(userValidation), userController);

module.exports = router;