import asyncHandler from 'express-async-handler';
import prisma from '../db/prisma.js';

/**
 * Track a user activity
 */
export const trackActivity = asyncHandler(async (req, res) => {
  const { action, description, metadata } = req.body;
  const userId = req.user.id;

  if (!action) {
    res.status(400);
    throw new Error('Action is required');
  }

  // Get IP address and user agent from request
  const ipAddress = req.ip || req.connection.remoteAddress || req.headers['x-forwarded-for']?.split(',')[0];
  const userAgent = req.headers['user-agent'];

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
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      },
    },
  });

  res.status(201).json({
    success: true,
    data: activity,
  });
});

/**
 * Get current user's activities
 */
export const getMyActivities = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { limit = 50, offset = 0, action } = req.query;

  const where = {
    userId,
    ...(action && { action }),
  };

  const [activities, total] = await Promise.all([
    prisma.userActivity.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: parseInt(limit),
      skip: parseInt(offset),
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
      },
    }),
    prisma.userActivity.count({ where }),
  ]);

  res.status(200).json({
    success: true,
    data: {
      activities,
      total,
      limit: parseInt(limit),
      offset: parseInt(offset),
    },
  });
});

/**
 * Get activities for a specific user (admin only or own activities)
 */
export const getUserActivities = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const currentUserId = req.user.id;
  const { limit = 50, offset = 0, action } = req.query;

  // Get current user to check role
  const currentUser = await prisma.user.findUnique({
    where: { id: currentUserId },
    select: { role: true },
  });

  // Only allow admins to view other users' activities, or users viewing their own
  if (userId !== currentUserId && currentUser.role !== 'ADMIN' && currentUser.role !== 'SUPER_ADMIN') {
    res.status(403);
    throw new Error('Access denied. You can only view your own activities.');
  }

  const where = {
    userId,
    ...(action && { action }),
  };

  const [activities, total] = await Promise.all([
    prisma.userActivity.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: parseInt(limit),
      skip: parseInt(offset),
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
      },
    }),
    prisma.userActivity.count({ where }),
  ]);

  res.status(200).json({
    success: true,
    data: {
      activities,
      total,
      limit: parseInt(limit),
      offset: parseInt(offset),
    },
  });
});

/**
 * Update user's online status (heartbeat)
 */
export const updateOnlineStatus = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  const user = await prisma.user.update({
    where: { id: userId },
    data: {
      isOnline: true,
      lastSeen: new Date(),
    },
    select: {
      id: true,
      isOnline: true,
      lastSeen: true,
    },
  });

  res.status(200).json({
    success: true,
    message: 'Status updated',
    data: user,
  });
});

/**
 * Set user offline (without logging LOGOUT activity)
 * This is used for page refreshes, tab closes, etc.
 * Actual logout should use the logout endpoint which logs LOGOUT activity
 */
export const setUserOffline = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  // Just update online status, don't log LOGOUT activity
  // LOGOUT should only be logged when user explicitly logs out
  const user = await prisma.user.update({
    where: { id: userId },
    data: {
      isOnline: false,
      lastSeen: new Date(),
    },
    select: {
      id: true,
      isOnline: true,
      lastSeen: true,
    },
  });

  res.status(200).json({
    success: true,
    message: 'User set to offline',
    data: user,
  });
});

/**
 * Get all online users (admin only)
 */
export const getOnlineUsers = asyncHandler(async (req, res) => {
  const currentUserId = req.user.id;

  // Check if user is admin
  const currentUser = await prisma.user.findUnique({
    where: { id: currentUserId },
    select: { role: true },
  });

  if (currentUser.role !== 'ADMIN' && currentUser.role !== 'SUPER_ADMIN') {
    res.status(403);
    throw new Error('Access denied. Admin access required.');
  }

  const onlineUsers = await prisma.user.findMany({
    where: {
      isOnline: true,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      isOnline: true,
      lastSeen: true,
      createdAt: true,
    },
    orderBy: {
      lastSeen: 'desc',
    },
  });

  res.status(200).json({
    success: true,
    data: onlineUsers,
  });
});

/**
 * Get activity statistics for a user
 */
export const getActivityStats = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const currentUserId = req.user.id;
  const { days = 30 } = req.query;

  // Get current user to check role
  const currentUser = await prisma.user.findUnique({
    where: { id: currentUserId },
    select: { role: true },
  });

  // Only allow admins to view other users' stats, or users viewing their own
  if (userId !== currentUserId && currentUser.role !== 'ADMIN' && currentUser.role !== 'SUPER_ADMIN') {
    res.status(403);
    throw new Error('Access denied. You can only view your own statistics.');
  }

  const daysAgo = new Date();
  daysAgo.setDate(daysAgo.getDate() - parseInt(days));

  const where = {
    userId,
    createdAt: {
      gte: daysAgo,
    },
  };

  const [totalActivities, activitiesByAction] = await Promise.all([
    prisma.userActivity.count({ where }),
    prisma.userActivity.groupBy({
      by: ['action'],
      where,
      _count: {
        action: true,
      },
    }),
  ]);

  const recentActivities = await prisma.userActivity.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    take: 10,
    select: {
      id: true,
      action: true,
      description: true,
      createdAt: true,
    },
  });

  res.status(200).json({
    success: true,
    data: {
      totalActivities,
      activitiesByAction: activitiesByAction.map((item) => ({
        action: item.action,
        count: item._count.action,
      })),
      recentActivities,
      period: `${days} days`,
    },
  });
});

/**
 * Delete old activity logs (older than specified days)
 * This is typically called by a scheduled job
 */
export const deleteOldActivityLogs = asyncHandler(async (req, res) => {
  const { days = 7 } = req.query;

  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - parseInt(days));

  const result = await prisma.userActivity.deleteMany({
    where: {
      createdAt: {
        lt: cutoffDate,
      },
    },
  });

  res.status(200).json({
    success: true,
    message: `Deleted ${result.count} activity logs older than ${days} days`,
    deletedCount: result.count,
  });
});
