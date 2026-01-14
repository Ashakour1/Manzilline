import { cleanupOldActivityLogs, markInactiveUsersOffline } from '../middlewares/activity.middleware.js';

/**
 * Initialize scheduled jobs for activity tracking
 */
export const initializeScheduledJobs = () => {
  // Clean up old activity logs (older than 7 days) - Run daily at 2 AM
  const cleanupInterval = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

  setInterval(async () => {
    try {
      console.log('Running scheduled cleanup of old activity logs...');
      await cleanupOldActivityLogs(7); // Delete logs older than 7 days
      console.log('Cleanup completed successfully');
    } catch (error) {
      console.error('Error in scheduled cleanup:', error);
    }
  }, cleanupInterval);

  // Run cleanup immediately on startup (optional)
  // This ensures logs are cleaned up even if the server was down for a while
  setTimeout(async () => {
    try {
      console.log('Running initial cleanup of old activity logs...');
      await cleanupOldActivityLogs(7);
      console.log('Initial cleanup completed successfully');
    } catch (error) {
      console.error('Error in initial cleanup:', error);
    }
  }, 5000); // Wait 5 seconds after server starts

  // Mark inactive users as offline - Run every 5 minutes
  const inactiveCheckInterval = 5 * 60 * 1000; // 5 minutes in milliseconds

  setInterval(async () => {
    try {
      await markInactiveUsersOffline();
    } catch (error) {
      console.error('Error marking inactive users offline:', error);
    }
  }, inactiveCheckInterval);

  console.log('Scheduled jobs initialized:');
  console.log('- Activity log cleanup: Every 24 hours (deletes logs older than 7 days)');
  console.log('- Inactive user check: Every 5 minutes');
};
