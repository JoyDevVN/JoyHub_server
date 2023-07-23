import express from 'express';
import authController from '../controllers/auth.controller';

const router = express.Router();
/// /api/auth
/// /api/auth/register
/// req.body: { username, email, password, role_id, wallet }
/// res: { message, created }
router.post('/register', authController.registerAccount);
router.get('/accounts', authController.verify, authController.getAllAccounts);
/// /api/auth/login
/// req.body: { username, password }
/// res: { message, login }
router.post('/login', authController.loginAccount);
router.get('/test', (req, res) => {
    res.json({ message: "test" });
});

export default router;
