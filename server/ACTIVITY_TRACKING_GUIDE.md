# User Activity Tracking System

This system automatically tracks user activities and deletes logs older than 7 days.

## Features

- ✅ Automatic activity logging on login/logout
- ✅ Automatic tracking of POST, PUT, DELETE, PATCH requests
- ✅ Manual activity tracking via API or utility functions
- ✅ Auto-delete logs older than 7 days (runs daily)
- ✅ Online/offline status tracking
- ✅ Activity statistics and analytics

## Database Setup

1. Run Prisma migration to create the `UserActivity` table:

```bash
cd server
npx prisma migrate dev --name add_user_activity_tracking
```

2. Generate Prisma client:

```bash
npx prisma generate
```

## API Endpoints

All endpoints are prefixed with `/api/v1/activity` and require authentication.

### Track Activity
```
POST /api/v1/activity/track
Body: {
  "action": "VIEW_PROPERTY",
  "description": "User viewed property details",
  "metadata": {"propertyId": "123"}
}
```

### Get My Activities
```
GET /api/v1/activity/me?limit=50&offset=0&action=LOGIN
```

### Get User Activities (Admin only)
```
GET /api/v1/activity/user/:userId?limit=50&offset=0
```

### Update Online Status (Heartbeat)
```
POST /api/v1/activity/online
```

### Set User Offline
```
POST /api/v1/activity/offline
```

### Get Online Users (Admin only)
```
GET /api/v1/activity/online-users
```

### Get Activity Statistics
```
GET /api/v1/activity/stats/:userId?days=30
```

### Manual Cleanup (Admin only)
```
DELETE /api/v1/activity/cleanup?days=7
```

## Usage Examples

### Backend: Manual Activity Logging

```javascript
import { logActivity, logActivityFromRequest } from '../utils/activityLogger.js';

// From a request object (automatically extracts IP and user agent)
await logActivityFromRequest(
  req,
  'CREATE_PROPERTY',
  'User created a new property',
  { propertyId: '123', title: 'Beautiful Apartment' }
);

// Direct logging
await logActivity({
  userId: 'user123',
  action: 'UPDATE_USER',
  description: 'User updated profile',
  metadata: { field: 'email', oldValue: 'old@email.com', newValue: 'new@email.com' },
  ipAddress: req.ip,
  userAgent: req.headers['user-agent'],
});
```

### Frontend: Track Activity via API

```typescript
// Using fetch
const response = await fetch('/api/v1/activity/track', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    action: 'VIEW_PROPERTY',
    description: 'User viewed property details',
    metadata: { propertyId: '123' }
  })
});
```

## Automatic Tracking

The system automatically tracks:
- **Login**: Logged when user logs in
- **Logout**: Logged when user logs out
- **HTTP Methods**: POST, PUT, DELETE, PATCH requests are automatically logged
- **Online Status**: Updated on authenticated requests

## Auto-Deletion

- **Schedule**: Runs every 24 hours
- **Retention**: Logs older than 7 days are automatically deleted
- **Initial Cleanup**: Runs 5 seconds after server startup
- **Manual Trigger**: Available via DELETE `/api/v1/activity/cleanup?days=7`

## Activity Action Naming Convention

Use consistent action names:
- `LOGIN`, `LOGOUT`
- `CREATE_PROPERTY`, `UPDATE_PROPERTY`, `DELETE_PROPERTY`, `VIEW_PROPERTY`
- `CREATE_USER`, `UPDATE_USER`, `DELETE_USER`
- `CREATE_LANDLORD`, `UPDATE_LANDLORD`
- `CREATE_PAYMENT`, `UPDATE_PAYMENT`
- etc.

## Metadata Format

Store structured data as JSON:

```javascript
{
  "propertyId": "123",
  "propertyTitle": "Beautiful Apartment",
  "actionType": "view",
  "previousValue": "old value",
  "newValue": "new value"
}
```

## Scheduled Jobs

The system runs two scheduled jobs:

1. **Activity Log Cleanup**: Every 24 hours
   - Deletes logs older than 7 days
   - Logs cleanup results

2. **Inactive User Check**: Every 5 minutes
   - Marks users as offline if `lastSeen` is older than 5 minutes

## Notes

- Activity logging is **non-blocking** - errors won't break your main application flow
- All activities include IP address and user agent for security auditing
- Only admins can view other users' activities
- Users can always view their own activities
