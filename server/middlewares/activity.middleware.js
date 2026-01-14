import prisma from '../db/prisma.js';

/**
 * Middleware to automatically update user's lastSeen and isOnline status
 * on authenticated requests
 */
export const activityMiddleware = async (req, res, next) => {
  try {
    if (req.user && req.user.id) {
      // Update lastSeen and isOnline asynchronously (non-blocking)
      prisma.user
        .update({
          where: { id: req.user.id },
          data: {
            lastSeen: new Date(),
            isOnline: true,
          },
        })
        .catch((error) => {
          // Log error but don't block the request
          console.error('Error updating user activity status:', error);
        });

      // Log significant actions (POST, PUT, DELETE) automatically
      const method = req.method;
      if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(method)) {
        const action = `${method}_${req.route?.path || req.path}`.replace(/\//g, '_').toUpperCase();
        const description = `${method} request to ${req.path}`;

        // Track activity asynchronously (non-blocking)
        prisma.userActivity
          .create({
            data: {
              userId: req.user.id,
              action,
              description,
              ipAddress: req.ip || req.connection.remoteAddress || req.headers['x-forwarded-for']?.split(',')[0],
              userAgent: req.headers['user-agent'],
            },
          })
          .catch((error) => {
            // Log error but don't block the request
            console.error('Error tracking activity:', error);
          });
      }
    }
    next();
  } catch (error) {
    // Don't block the request if activity tracking fails
    console.error('Activity middleware error:', error);
    next();
  }
};

/**
 * Mark inactive users as offline
 * Users are considered inactive if lastSeen is older than 5 minutes
 */
export const markInactiveUsersOffline = async () => {
  try {
    const fiveMinutesAgo = new Date();
    fiveMinutesAgo.setMinutes(fiveMinutesAgo.getMinutes() - 5);

    const result = await prisma.user.updateMany({
      where: {
        isOnline: true,
        lastSeen: {
          lt: fiveMinutesAgo,
        },
      },
      data: {
        isOnline: false,
      },
    });

    console.log(`Marked ${result.count} inactive users as offline`);
    return result;
  } catch (error) {
    console.error('Error marking inactive users offline:', error);
    throw error;
  }
};

/**
 * Delete activity logs older than specified days
 * Default is 7 days
 */
export const cleanupOldActivityLogs = async (days = 7) => {
  try {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    const result = await prisma.userActivity.deleteMany({
      where: {
        createdAt: {
          lt: cutoffDate,
        },
      },
    });

    console.log(`Deleted ${result.count} activity logs older than ${days} days`);
    return result;
  } catch (error) {
    console.error('Error cleaning up old activity logs:', error);
    throw error;
  }
};
