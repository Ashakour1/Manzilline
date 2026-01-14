import { API_URL, getAuthHeaders } from "@/lib/api";

export interface Activity {
  id: string;
  userId: string;
  action: string;
  description: string | null;
  metadata: string | null;
  ipAddress: string | null;
  userAgent: string | null;
  createdAt: string;
  user?: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
}

export interface ActivityResponse {
  success: boolean;
  data: Activity;
}

export interface ActivitiesResponse {
  success: boolean;
  data: {
    activities: Activity[];
    total: number;
    limit: number;
    offset: number;
  };
}

export interface ActivityStats {
  success: boolean;
  data: {
    totalActivities: number;
    activitiesByAction: Array<{
      action: string;
      count: number;
    }>;
    recentActivities: Activity[];
    period: string;
  };
}

/**
 * Track a user activity
 */
export const trackActivity = async (
  action: string,
  description?: string,
  metadata?: Record<string, any> | string
): Promise<ActivityResponse> => {
  const response = await fetch(`${API_URL}/activity/track`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    body: JSON.stringify({
      action,
      description,
      metadata: typeof metadata === 'string' ? metadata : metadata ? JSON.stringify(metadata) : null,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: "Failed to track activity" }));
    throw new Error(errorData.message || errorData.error || "Failed to track activity");
  }

  return response.json();
};

/**
 * Update user's online status (heartbeat)
 */
export const updateOnlineStatus = async (): Promise<{ success: boolean; message: string; data: { id: string; isOnline: boolean; lastSeen: string } }> => {
  const response = await fetch(`${API_URL}/activity/online`, {
    method: "POST",
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: "Failed to update online status" }));
    throw new Error(errorData.message || errorData.error || "Failed to update online status");
  }

  return response.json();
};

/**
 * Set user offline
 */
export const setUserOffline = async (): Promise<{ success: boolean; message: string; data: { id: string; isOnline: boolean; lastSeen: string } }> => {
  const response = await fetch(`${API_URL}/activity/offline`, {
    method: "POST",
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: "Failed to set user offline" }));
    throw new Error(errorData.message || errorData.error || "Failed to set user offline");
  }

  return response.json();
};

/**
 * Get current user's activities
 */
export const getMyActivities = async (
  limit: number = 50,
  offset: number = 0,
  action?: string
): Promise<ActivitiesResponse> => {
  const params = new URLSearchParams({
    limit: limit.toString(),
    offset: offset.toString(),
  });

  if (action) {
    params.append("action", action);
  }

  const response = await fetch(`${API_URL}/activity/me?${params.toString()}`, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: "Failed to fetch activities" }));
    throw new Error(errorData.message || errorData.error || "Failed to fetch activities");
  }

  return response.json();
};

/**
 * Get activities for a specific user (admin only or own activities)
 */
export const getUserActivities = async (
  userId: string,
  limit: number = 50,
  offset: number = 0,
  action?: string
): Promise<ActivitiesResponse> => {
  const params = new URLSearchParams({
    limit: limit.toString(),
    offset: offset.toString(),
  });

  if (action) {
    params.append("action", action);
  }

  const response = await fetch(`${API_URL}/activity/user/${userId}?${params.toString()}`, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: "Failed to fetch user activities" }));
    throw new Error(errorData.message || errorData.error || "Failed to fetch user activities");
  }

  return response.json();
};

/**
 * Get all online users (admin only)
 */
export const getOnlineUsers = async (): Promise<{ success: boolean; data: Array<{ id: string; name: string; email: string; role: string; isOnline: boolean; lastSeen: string | null }> }> => {
  const response = await fetch(`${API_URL}/activity/online-users`, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: "Failed to fetch online users" }));
    throw new Error(errorData.message || errorData.error || "Failed to fetch online users");
  }

  return response.json();
};

/**
 * Get activity statistics for a user
 */
export const getActivityStats = async (
  userId: string,
  days: number = 30
): Promise<ActivityStats> => {
  const response = await fetch(`${API_URL}/activity/stats/${userId}?days=${days}`, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: "Failed to fetch activity stats" }));
    throw new Error(errorData.message || errorData.error || "Failed to fetch activity stats");
  }

  return response.json();
};
