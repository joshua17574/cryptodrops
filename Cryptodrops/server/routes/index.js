import express from 'express';
import authRoutes from './auth.routes.js';
import airdropRoutes from './airdrop.routes.js';
import newsletterRoutes from './newsletter.routes.js';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/airdrops', airdropRoutes);
router.use('/newsletter', newsletterRoutes);

export default router;
