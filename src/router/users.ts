import express from 'express';

// import { registerUser, loginUser } from '../controllers/users';
import {registerUser, loginUser, completeRegistration, updateBalance} from '../controllers/users'
import { tokenAuth } from '../middlewares/index';

export default (router: express.Router) => {
  router.post('/register', tokenAuth, registerUser);
  router.post('/login', tokenAuth, loginUser);
  router.patch('/update/:id', tokenAuth,completeRegistration);
  router.patch('/updateBalance/:id', tokenAuth, updateBalance);
};
