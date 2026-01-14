import express from 'express';
import { AuthMiddleware } from '../middlewares/auth.middleware.js';
import {
  trackActivity,
  getMyActivities,
  getUserActivities,
  updateOnlineStatus,
  setUserOffline,
  getOnlineUsers,
  getActivityStats,
  deleteOldActivityLogs,
} from '../controllers/activity.controller.js';

const router = express.Router();

// All routes require authentication
router.use(AuthMiddleware);

// Track activity
router.post('/track', trackActivity);

// Get current user's activities
router.get('/me', getMyActivities);

// Get activities for a specific user
router.get('/user/:userId', getUserActivities);

// Update online status (heartbeat)
router.post('/online', updateOnlineStatus);

// Set user offline
router.post('/offline', setUserOffline);

// Get all online users (admin only)
router.get('/online-users', getOnlineUsers);

// Get activity statistics
router.get('/stats/:userId', getActivityStats);

// Delete old activity logs (admin only, typically called by scheduled job)
router.delete('/cleanup', deleteOldActivityLogs);

export default router;
