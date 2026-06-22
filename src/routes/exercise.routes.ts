import { Router } from 'express';
import { handleGetExercises } from '../controllers/exercise.controller';
import { requireAuth } from '../middleware/auth.middleware';

const router = Router();

router.get('/', requireAuth, handleGetExercises);

export default router;
