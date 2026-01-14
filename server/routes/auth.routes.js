import express from 'express';
import { registerUser, loginUser, logoutUser } from '../controllers/auth.controller.js';
import { AuthMiddleware } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', AuthMiddleware, logoutUser);

export default router;