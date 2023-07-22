import express from 'express';
import { registerAccount, getAllAccounts, loginAccount, verify } from '../controllers/auth.controller';

const router = express.Router();
router.post('/register', registerAccount);
router.get('/accounts', verify, getAllAccounts);
router.post('/login', loginAccount);
router.get('/test', (req, res) => {
    res.json({ message: "test" });
});

export default router;
