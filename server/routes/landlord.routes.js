import express from 'express';
import { 
    registerLandlord, 
    getLandlords, 
    getLandlordById, 
    updateLandlord, 
    deleteLandlord,
    verifyLandlord,
    getLandlordsForAgent,
    updateLandlordStatus
} from '../controllers/landlord.controller.js';
import { AuthMiddleware } from '../middlewares/auth.middleware.js';
import { activityMiddleware } from '../middlewares/activity.middleware.js';

const router = express.Router();

// Public route for landlord registration (no auth required)
router.post('/register', registerLandlord);
// Admin route for landlord registration (auth required)
router.post('/', AuthMiddleware, activityMiddleware, registerLandlord);
router.get('/', getLandlords);
// Agent-specific endpoint for landlords
router.get('/agent', AuthMiddleware, activityMiddleware, getLandlordsForAgent);
router.get('/:id', getLandlordById);
router.put('/:id', AuthMiddleware, activityMiddleware, updateLandlord);
router.patch('/:id/verify', AuthMiddleware, activityMiddleware, verifyLandlord);
router.patch('/:id/status', AuthMiddleware, activityMiddleware, updateLandlordStatus);
router.delete('/:id', AuthMiddleware, activityMiddleware, deleteLandlord);

export default router;
