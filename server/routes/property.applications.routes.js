import express from 'express';
import { createPropertyApplication, getPropertyApplications, getPropertyApplicationById, updatePropertyApplication, deletePropertyApplication, getPropertyApplicationsByTenant } from '../controllers/property.applications.controller.js';

const router = express.Router();


router.post('/', createPropertyApplication);

router.get('/', getPropertyApplications);

router.get('/:id', getPropertyApplicationById);

router.put('/:id', updatePropertyApplication);

router.delete('/:id', deletePropertyApplication);

router.get('/tenant/:tenantId', getPropertyApplicationsByTenant);

export default router;
