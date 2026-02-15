import {Router} from 'express';

import seedRoutes from './seed.route';
import authRoutes from './auth.route';

import generateRoutes from './generate.route';



const router = Router();

// api/auth/
router.use('/auth', authRoutes)

// api/generate/diet
// api/generate/training
router.use('/generate', generateRoutes)
// api/dev/seed/
router.use('/dev', seedRoutes);


export default router;
