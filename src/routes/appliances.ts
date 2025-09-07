import express from 'express';
import { ApplianceController } from '../controllers/ApplianceController.js';
import { validateAppliance } from '../middleware/validation.js';

const router = express.Router();
const applianceController = new ApplianceController();

// GET /api/appliances - Get all appliances
router.get('/', applianceController.getAllAppliances.bind(applianceController));

// GET /api/appliances/:id - Get single appliance
router.get('/:id', applianceController.getApplianceById.bind(applianceController));

// POST /api/appliances - Create new appliance
router.post('/', validateAppliance, applianceController.createAppliance.bind(applianceController));

// PUT /api/appliances/:id - Update appliance
router.put('/:id', validateAppliance, applianceController.updateAppliance.bind(applianceController));

// DELETE /api/appliances/:id - Delete appliance
router.delete('/:id', applianceController.deleteAppliance.bind(applianceController));

// GET /api/appliances/stats/overview - Get statistics
router.get('/stats/overview', applianceController.getStats.bind(applianceController));

export default router;