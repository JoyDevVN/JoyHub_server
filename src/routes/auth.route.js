import express from 'express';
import { registerAccount, getAllAccounts, loginAccount, verify } from '../controllers/auth.controller';

const router = express.Router();
/// /api/auth
/// /api/auth/register
/// req.body: { username, email, password, role_id, wallet }
/// res: { message, created }
router.post('/register', registerAccount);
router.get('/accounts', verify, getAllAccounts);
/// /api/auth/login
/// req.body: { username, password }
/// res: { message, login }
router.post('/login', loginAccount);
router.get('/test', (req, res) => {
    res.json({ message: "test" });
});

export default router;
