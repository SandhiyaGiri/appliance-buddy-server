import express from 'express';
import { ApplianceController } from '../controllers/ApplianceController.js';
import { validateAppliance } from '../middleware/validation.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();
const applianceController = new ApplianceController();

// GET /api/appliances - Get all appliances (protected)
router.get('/', authenticateToken, applianceController.getAllAppliances.bind(applianceController));

// GET /api/appliances/:id - Get single appliance (protected)
router.get('/:id', authenticateToken, applianceController.getApplianceById.bind(applianceController));

// POST /api/appliances - Create new appliance (protected)
router.post('/', authenticateToken, validateAppliance, applianceController.createAppliance.bind(applianceController));

// PUT /api/appliances/:id - Update appliance (protected)
router.put('/:id', authenticateToken, validateAppliance, applianceController.updateAppliance.bind(applianceController));

// DELETE /api/appliances/:id - Delete appliance (protected)
router.delete('/:id', authenticateToken, applianceController.deleteAppliance.bind(applianceController));

// GET /api/appliances/stats/overview - Get statistics (protected)
router.get('/stats/overview', authenticateToken, applianceController.getStats.bind(applianceController));

export default router;