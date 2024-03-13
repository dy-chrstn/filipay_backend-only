import express from 'express';

import users from './users';
import token from './token';

const router = express.Router();

export default (): express.Router => {
  users(router);
  token(router);

  return router;
};

