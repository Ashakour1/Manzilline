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
import { activityMiddleware } from '../middlewares/activity.middleware.js';

const router = express.Router();

// Apply activity middleware after auth middleware for all routes
router.get('/', AuthMiddleware, activityMiddleware, getUsers);
router.get('/me', AuthMiddleware, activityMiddleware, getCurrentUser);
router.get('/:id', AuthMiddleware, activityMiddleware, getUserById);
router.post('/', AuthMiddleware, activityMiddleware, createUser);
router.put('/:id', AuthMiddleware, activityMiddleware, updateUser);
router.delete('/:id', AuthMiddleware, activityMiddleware, deleteUser);

export default router;
