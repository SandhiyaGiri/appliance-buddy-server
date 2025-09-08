import express from 'express';
import applianceRoutes from './appliances.js';
import authRoutes from './auth.js';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/appliances', applianceRoutes);

export default router;
