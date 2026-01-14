# User Activity Tracking & Online/Offline Status System

This document explains the user activity tracking and online/offline status system implemented in the Manzilline application.

## Table of Contents

1. [Overview](#overview)
2. [Database Schema](#database-schema)
3. [Backend Implementation](#backend-implementation)
4. [Frontend Implementation](#frontend-implementation)
5. [API Endpoints](#api-endpoints)
6. [Usage Examples](#usage-examples)
7. [Setup Instructions](#setup-instructions)
8. [How It Works](#how-it-works)

## Overview

The user activity tracking system provides:

- **Real-time online/offline status** for all users
- **Activity logging** for user actions (login, logout, property views, etc.)
- **Activity statistics** and analytics
- **Automatic status updates** via heartbeat mechanism
- **Admin dashboard** to view online users and activity logs

## Database Schema

### User Model Updates

The `User` model has been extended with:

```prisma
model User {
  // ... existing fields
  isOnline              Boolean               @default(false)
  lastSeen              DateTime?
  activities            UserActivity[]
}
```

### UserActivity Model

A new `UserActivity` model tracks all user activities:

```prisma
model UserActivity {
  id          String   @id @default(cuid())
  userId      String
  action      String   // e.g., "LOGIN", "LOGOUT", "VIEW_PROPERTY", etc.
  description String?
  metadata    String?  // JSON string for additional data
  ipAddress   String?
  userAgent   String?
  createdAt   DateTime @default(now())
  user        User     @relation(...)
}
```

**Indexes:**
- `userId` - for fast user activity queries
- `createdAt` - for time-based queries
- `action` - for filtering by action type

## Backend Implementation

### Files Created/Modified

1. **Schema**: `server/prisma/schema.prisma`
   - Added `isOnline` and `lastSeen` to User model
   - Created `UserActivity` model

2. **Controller**: `server/controllers/activity.controller.js`
   - Handles all activity-related endpoints
   - Functions:
     - `trackActivity()` - Log a user activity
     - `getUserActivities()` - Get activities for a user
     - `getMyActivities()` - Get current user's activities
     - `getOnlineUsers()` - Get all online users (admin only)
     - `updateOnlineStatus()` - Heartbeat endpoint
     - `setUserOffline()` - Mark user as offline
     - `getActivityStats()` - Get activity statistics

3. **Middleware**: `server/middlewares/activity.middleware.js`
   - `activityMiddleware()` - Automatically updates user's `lastSeen` and `isOnline` on authenticated requests
   - `markInactiveUsersOffline()` - Background job to mark inactive users offline

4. **Routes**: `server/routes/activity.routes.js`
   - All routes require authentication
   - Mounted at `/api/v1/activity`

5. **Auth Controller**: `server/controllers/auth.controller.js`
   - Updated `loginUser()` to:
     - Set user as online on login
     - Log login activity
     - Update `lastSeen` timestamp

6. **Server**: `server/server.js`
   - Added activity routes: `app.use('/api/v1/activity', activityRoutes)`

## Frontend Implementation

### Files Created

1. **Service**: `admin/services/activity.service.ts`
   - TypeScript service with all activity-related API calls
   - Functions:
     - `trackActivity()`
     - `updateOnlineStatus()`
     - `setUserOffline()`
     - `getMyActivities()`
     - `getUserActivities()`
     - `getOnlineUsers()`
     - `getActivityStats()`

2. **Hook**: `admin/hooks/use-activity-tracker.ts`
   - `useActivityTracker()` - Automatically tracks online status
     - Sends heartbeat every 2 minutes
     - Updates status on tab visibility changes
     - Sets user offline on component unmount
     - Handles page unload events
   - `useActivityTracking()` - Hook for manually tracking activities

3. **Layout Updates**:
   - `admin/app/(dashboard)/layout.tsx` - Added `useActivityTracker()`
   - `admin/app/agent/layout.tsx` - Added `useActivityTracker()`

## API Endpoints

All endpoints are prefixed with `/api/v1/activity` and require authentication.

### POST `/activity/track`
Track a user activity.

**Request Body:**
```json
{
  "action": "VIEW_PROPERTY",
  "description": "User viewed property details",
  "metadata": "{\"propertyId\": \"123\"}"
}
```

**Response:**
```json
{
  "id": "activity_id",
  "userId": "user_id",
  "action": "VIEW_PROPERTY",
  "description": "User viewed property details",
  "createdAt": "2024-01-01T00:00:00Z",
  ...
}
```

### POST `/activity/online`
Update user's online status (heartbeat).

**Response:**
```json
{
  "message": "Status updated",
  "isOnline": true,
  "lastSeen": "2024-01-01T00:00:00Z"
}
```

### POST `/activity/offline`
Set user offline.

**Response:**
```json
{
  "message": "User set to offline",
  "isOnline": false
}
```

### GET `/activity/me`
Get current user's activities.

**Query Parameters:**
- `limit` (default: 50) - Number of activities to return
- `offset` (default: 0) - Pagination offset
- `action` (optional) - Filter by action type

**Response:**
```json
{
  "activities": [...],
  "total": 100,
  "limit": 50,
  "offset": 0
}
```

### GET `/activity/user/:userId`
Get activities for a specific user (admin only or own activities).

**Query Parameters:** Same as `/activity/me`

### GET `/activity/online-users`
Get all online users (admin only).

**Response:**
```json
[
  {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "ADMIN",
    "isOnline": true,
    "lastSeen": "2024-01-01T00:00:00Z",
    ...
  }
]
```

### GET `/activity/stats/:userId`
Get activity statistics for a user.

**Query Parameters:**
- `days` (default: 30) - Number of days to analyze

**Response:**
```json
{
  "totalActivities": 150,
  "activitiesByAction": [
    { "action": "LOGIN", "count": 20 },
    { "action": "VIEW_PROPERTY", "count": 100 },
    ...
  ],
  "recentActivities": [...],
  "period": "30 days"
}
```

## Usage Examples

### Backend: Manually Track Activity

```javascript
import { trackActivity } from '../controllers/activity.controller.js';

// In your controller
await trackActivity({
  userId: req.user.id,
  action: 'CREATE_PROPERTY',
  description: 'User created a new property',
  metadata: { propertyId: '123' }
});
```

### Frontend: Track Custom Activity

```typescript
import { useActivityTracking } from '@/hooks/use-activity-tracker';

function MyComponent() {
  const { trackActivity } = useActivityTracking();

  const handlePropertyView = async (propertyId: string) => {
    await trackActivity(
      'VIEW_PROPERTY',
      'User viewed property details',
      { propertyId }
    );
  };

  return <button onClick={() => handlePropertyView('123')}>View</button>;
}
```

### Frontend: Get Online Users (Admin)

```typescript
import { getOnlineUsers } from '@/services/activity.service';

async function fetchOnlineUsers() {
  try {
    const onlineUsers = await getOnlineUsers();
    console.log('Online users:', onlineUsers);
  } catch (error) {
    console.error('Failed to fetch online users:', error);
  }
}
```

### Frontend: Get Activity Statistics

```typescript
import { getActivityStats } from '@/services/activity.service';

async function fetchStats(userId: string) {
  try {
    const stats = await getActivityStats(userId, 7); // Last 7 days
    console.log('Activity stats:', stats);
  } catch (error) {
    console.error('Failed to fetch stats:', error);
  }
}
```

## Setup Instructions

### 1. Database Migration

Run Prisma migration to update the database schema:

```bash
cd server
npx prisma migrate dev --name add_user_activity_tracking
```

Or if you prefer to generate the migration manually:

```bash
npx prisma migrate dev
```

### 2. Generate Prisma Client

After migration, generate the Prisma client:

```bash
npx prisma generate
```

### 3. Optional: Background Job for Inactive Users

To automatically mark users as offline after inactivity, you can set up a cron job or scheduled task:

```javascript
// In server.js or a separate cron file
import { markInactiveUsersOffline } from './middlewares/activity.middleware.js';

// Run every 5 minutes
setInterval(async () => {
  await markInactiveUsersOffline();
}, 5 * 60 * 1000);
```

### 4. Verify Installation

1. Start the server:
   ```bash
   cd server
   npm start
   ```

2. Login to the admin panel
3. Check that the user's `isOnline` status is set to `true`
4. Check that a login activity is logged in the database

## How It Works

### Online/Offline Status Flow

1. **Login**: When a user logs in, the system:
   - Sets `isOnline = true`
   - Updates `lastSeen = now()`
   - Logs a `LOGIN` activity

2. **Heartbeat**: Every 2 minutes while the user is active:
   - Frontend sends a heartbeat to `/activity/online`
   - Backend updates `lastSeen` and ensures `isOnline = true`

3. **Activity Tracking**: On authenticated requests:
   - Middleware automatically updates `lastSeen` and `isOnline`
   - Significant actions (POST, PUT, DELETE) are logged

4. **Logout/Unmount**: When user logs out or closes the app:
   - Frontend calls `/activity/offline`
   - Backend sets `isOnline = false`
   - Updates `lastSeen`
   - Logs a `LOGOUT` activity

5. **Inactive Users**: Background job (optional):
   - Runs periodically (e.g., every 5 minutes)
   - Marks users as offline if `lastSeen` is older than threshold (5 minutes)

### Activity Logging Flow

1. **Automatic Logging**:
   - Login/Logout actions are automatically logged
   - Significant HTTP methods (POST, PUT, DELETE) are logged by middleware

2. **Manual Logging**:
   - Use `trackActivity()` function or `useActivityTracking()` hook
   - Specify action, description, and optional metadata

3. **Activity Storage**:
   - All activities are stored in `UserActivity` table
   - Includes IP address and user agent for security auditing
   - Metadata stored as JSON string for flexibility

### Frontend Activity Tracker Hook

The `useActivityTracker` hook:

1. **Initialization**: Sends initial heartbeat when component mounts
2. **Periodic Updates**: Sets interval to send heartbeat every 2 minutes
3. **Visibility Handling**: Sends heartbeat when tab becomes visible
4. **Cleanup**: Sets user offline when component unmounts
5. **Page Unload**: Attempts to set user offline on page unload (using `keepalive` flag)

## Best Practices

1. **Activity Actions**: Use consistent action naming:
   - `LOGIN`, `LOGOUT`
   - `VIEW_PROPERTY`, `CREATE_PROPERTY`, `UPDATE_PROPERTY`, `DELETE_PROPERTY`
   - `VIEW_USER`, `CREATE_USER`, etc.

2. **Metadata**: Store structured data in metadata field as JSON:
   ```json
   {
     "propertyId": "123",
     "propertyTitle": "Beautiful Apartment",
     "actionType": "view"
   }
   ```

3. **Performance**: 
   - Activity logging is non-blocking (errors don't affect main flow)
   - Use pagination when fetching activities
   - Consider archiving old activities periodically

4. **Privacy**: 
   - IP addresses and user agents are stored for security auditing
   - Consider GDPR compliance for EU users
   - Allow users to view their own activity logs

## Troubleshooting

### Users Not Showing as Online

1. Check that `useActivityTracker()` is called in the layout
2. Verify the user is authenticated
3. Check browser console for API errors
4. Verify the heartbeat endpoint is working: `POST /api/v1/activity/online`

### Activities Not Being Logged

1. Check that the user is authenticated
2. Verify the activity endpoint: `POST /api/v1/activity/track`
3. Check server logs for errors
4. Verify database connection

### Database Errors

1. Ensure Prisma migration was run successfully
2. Check that Prisma client is generated: `npx prisma generate`
3. Verify database connection string in `.env`

## Future Enhancements

Potential improvements:

1. **Real-time Updates**: Use WebSockets or Server-Sent Events for real-time online status
2. **Activity Dashboard**: Admin UI to view and filter activities
3. **Activity Analytics**: Charts and graphs for activity trends
4. **Activity Export**: Export activity logs to CSV/PDF
5. **Activity Notifications**: Notify admins of important activities
6. **Session Management**: Track user sessions with start/end times
7. **Geolocation**: Track user location (with permission)

## Support

For issues or questions:
1. Check server logs for errors
2. Verify database schema matches Prisma schema
3. Test API endpoints using Postman or curl
4. Check browser console for frontend errors

---

**Last Updated**: January 2024
**Version**: 1.0.0
