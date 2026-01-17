import express from 'express';
import { getReports } from '../controllers/reports.controller.js';
import { AuthMiddleware } from '../middlewares/auth.middleware.js';

const router = express.Router();

// All reports routes require authentication
router.get('/', AuthMiddleware, getReports);

export default router;

