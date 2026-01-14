import express from 'express';
import { getReports } from '../controllers/reports.controller.js';
import { AuthMiddleware } from '../middlewares/auth.middleware.js';
import { activityMiddleware } from '../middlewares/activity.middleware.js';

const router = express.Router();

// All reports routes require authentication
router.get('/', AuthMiddleware, activityMiddleware, getReports);

export default router;

