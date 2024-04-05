import express from 'express';

// import { registerUser, loginUser } from '../controllers/users';
import { registerUser, loginUser, completeRegistration, updateBalance, findWallet, getTransactionHistories } from '../controllers/users'
import { checkCredentials, tokenAuth } from '../middlewares/index';

export default (router: express.Router) => {
  router.post('/register', tokenAuth, checkCredentials, registerUser);
  router.post('/login', tokenAuth, checkCredentials, loginUser);
  router.get('/getWallet/:id', tokenAuth, findWallet);
  router.get('/getHistories/:id', tokenAuth, getTransactionHistories);
  router.patch('/update/:id', tokenAuth, completeRegistration);
  router.patch('/updateBalance/:id', tokenAuth, updateBalance);
};
