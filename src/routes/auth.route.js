import express from 'express';
import authController from '../controllers/auth.controller';

const router = express.Router();
router.post('/register', authController.registerAccount);
// router.get('/accounts', authController.verify, authController.getAllAccounts);
router.post('/login', authController.loginAccount);
router.get('/test', (req, res) => {
    res.json({ message: "test" });
});
export default router;
