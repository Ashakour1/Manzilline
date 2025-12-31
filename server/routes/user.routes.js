import express from 'express';
import { 
    getUsers, 
    getCurrentUser,
    getUserById, 
    createUser, 
    updateUser, 
    deleteUser 
} from '../controllers/user.controller.js';
import { AuthMiddleware } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.get('/', AuthMiddleware, getUsers);
router.get('/me', AuthMiddleware, getCurrentUser);
router.get('/:id', AuthMiddleware, getUserById);
router.post('/', AuthMiddleware, createUser);
router.put('/:id', AuthMiddleware, updateUser);
router.delete('/:id', AuthMiddleware, deleteUser);

export default router;
