import { Router } from 'express';
import { requireAuth } from '../middleware/auth.middleware';
import { handleGetMyHistory, handleSaveSession } from '../controllers/workout.controller';

const router = Router();

router.post('/', requireAuth, handleSaveSession);
router.get('/me', requireAuth, handleGetMyHistory);

export default router;
