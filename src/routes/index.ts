import express from 'express';
import applianceRoutes from './appliances.js';

const router = express.Router();

router.use('/appliances', applianceRoutes);

export default router;
