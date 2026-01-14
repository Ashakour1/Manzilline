import prisma from '../db/prisma.js';

/**
 * Utility function to log user activities
 * This can be used anywhere in the codebase to track activities
 * 
 * @param {Object} options - Activity logging options
 * @param {string} options.userId - User ID performing the action
 * @param {string} options.action - Action type (e.g., 'CREATE_PROPERTY', 'UPDATE_USER')
 * @param {string} [options.description] - Human-readable description
 * @param {Object|string} [options.metadata] - Additional metadata (will be JSON stringified)
 * @param {string} [options.ipAddress] - IP address (optional)
 * @param {string} [options.userAgent] - User agent (optional)
 * @returns {Promise<Object>} Created activity record
 */
export const logActivity = async ({
  userId,
  action,
  description = null,
  metadata = null,
  ipAddress = null,
  userAgent = null,
}) => {
  try {
    // Convert metadata to JSON string if it's an object
    let metadataString = null;
    if (metadata) {
      metadataString = typeof metadata === 'string' ? metadata : JSON.stringify(metadata);
    }

    const activity = await prisma.userActivity.create({
      data: {
        userId,
        action,
        description,
        metadata: metadataString,
        ipAddress,
        userAgent,
      },
    });

    return activity;
  } catch (error) {
    // Log error but don't throw - activity logging should not break main flow
    console.error('Error logging activity:', error);
    return null;
  }
};

/**
 * Helper function to log activity from a request object
 * Extracts IP and user agent from request automatically
 * 
 * @param {Object} req - Express request object
 * @param {string} action - Action type
 * @param {string} [description] - Description
 * @param {Object|string} [metadata] - Metadata
 */
export const logActivityFromRequest = async (req, action, description = null, metadata = null) => {
  if (!req.user || !req.user.id) {
    console.warn('Cannot log activity: No user in request');
    return null;
  }

  const ipAddress = req.ip || req.connection.remoteAddress || req.headers['x-forwarded-for']?.split(',')[0];
  const userAgent = req.headers['user-agent'];

  return await logActivity({
    userId: req.user.id,
    action,
    description,
    metadata,
    ipAddress,
    userAgent,
  });
};
