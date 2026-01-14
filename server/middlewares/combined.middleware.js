import { AuthMiddleware } from './auth.middleware.js';
import { activityMiddleware } from './activity.middleware.js';

/**
 * Combined middleware that applies authentication and activity tracking
 * Use this for routes that need both authentication and activity logging
 */
export const authenticatedWithActivity = [
  AuthMiddleware,
  activityMiddleware,
];
