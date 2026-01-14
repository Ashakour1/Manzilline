"use client";

import { useEffect, useRef, useCallback } from "react";
import { useAuthStore } from "@/store/authStore";
import { updateOnlineStatus, setUserOffline, trackActivity } from "@/services/activity.service";
import { API_URL } from "@/lib/api";

/**
 * Hook to automatically track user online status
 * Sends heartbeat every 2 minutes and handles visibility changes
 */
export const useActivityTracker = () => {
  const { isLoggedIn, user } = useAuthStore();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const isUnmountingRef = useRef(false);

  // Send heartbeat to update online status
  const sendHeartbeat = useCallback(async () => {
    if (!isLoggedIn || !user || isUnmountingRef.current) {
      return;
    }

    try {
      await updateOnlineStatus();
    } catch (error) {
      // Silently fail - don't break the app if activity tracking fails
      console.error("Failed to update online status:", error);
    }
  }, [isLoggedIn, user]);

  // Handle visibility change
  useEffect(() => {
    if (!isLoggedIn || !user) return;

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        sendHeartbeat();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [isLoggedIn, user, sendHeartbeat]);

  // Set up periodic heartbeat
  useEffect(() => {
    if (!isLoggedIn || !user) return;

    // Send initial heartbeat
    sendHeartbeat();

    // Set up interval for heartbeat (every 2 minutes)
    intervalRef.current = setInterval(() => {
      sendHeartbeat();
    }, 2 * 60 * 1000); // 2 minutes

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isLoggedIn, user, sendHeartbeat]);

  // Handle page unload
  useEffect(() => {
    if (!isLoggedIn || !user) return;

    const handleBeforeUnload = () => {
      isUnmountingRef.current = true;
      // Use sendBeacon for reliable offline tracking on page unload
      if (navigator.sendBeacon) {
        const token = user.token;
        const headers = new Headers();
        headers.append("Authorization", `Bearer ${token}`);
        headers.append("Content-Type", "application/json");
        
        // Note: sendBeacon doesn't support custom headers well, so we'll use fetch with keepalive
        fetch(`${API_URL}/activity/offline`, {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({}),
          keepalive: true,
        }).catch(() => {
          // Ignore errors on unload
        });
      } else {
        // Fallback: try to set offline synchronously
        setUserOffline().catch(() => {
          // Ignore errors on unload
        });
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [isLoggedIn, user]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isUnmountingRef.current = true;
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      // Don't set user offline on unmount - this causes issues on page refresh
      // The beforeunload handler will handle actual page navigation
      // Only set offline if it's a real navigation (not a refresh)
    };
  }, [isLoggedIn, user]);
};

/**
 * Hook for manually tracking activities
 */
export const useActivityTracking = () => {
  const { isLoggedIn, user } = useAuthStore();

  const track = useCallback(
    async (
      action: string,
      description?: string,
      metadata?: Record<string, any> | string
    ) => {
      if (!isLoggedIn || !user) {
        console.warn("Cannot track activity: User not logged in");
        return;
      }

      try {
        await trackActivity(action, description, metadata);
      } catch (error) {
        // Log error but don't throw - activity tracking should not break the app
        console.error("Failed to track activity:", error);
      }
    },
    [isLoggedIn, user]
  );

  return { trackActivity: track };
};
