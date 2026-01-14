import express from 'express';
import { getProperties, getPropertyById, createProperty, updateProperty, deleteProperty, getPropertyTypes, getPropertyCountsByCity, getPropertiesForUser } from '../controllers/property.controller.js';
import { upload } from '../config/multer.js';
import { AuthMiddleware } from '../middlewares/auth.middleware.js';
import { activityMiddleware } from '../middlewares/activity.middleware.js';

const router = express.Router();

router.get('/types', getPropertyTypes);
router.get('/cities/counts', getPropertyCountsByCity);

router.get('/', getProperties);

router.get('/specific', AuthMiddleware, activityMiddleware, getPropertiesForUser);

// Agent-specific endpoint for properties
router.get('/agent', AuthMiddleware, activityMiddleware, getPropertiesForUser);

router.get('/:id', getPropertyById);

router.post("/", AuthMiddleware, activityMiddleware, upload.array("images", 10), createProperty);

router.put('/:id', AuthMiddleware, activityMiddleware, updateProperty);

router.delete('/:id', AuthMiddleware, activityMiddleware, deleteProperty);

export default router;