var router = new (require('express')).Router;

import { userController } from '../controllers';

router.all('/', userController);

module.exports = router;