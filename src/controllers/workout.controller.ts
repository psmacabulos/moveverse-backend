import { saveSession, getMyHistory } from '../services/workout.service';
import { Response, Request } from 'express';
import { AppError } from '../services/auth.service';

const handleError = (error: unknown, res: Response): void => {
  if (error instanceof AppError) {
    res.status(error.statusCode).json({ error: error.message });
    return;
  }
  res.status(500).json({ error: 'Something went wrong' });
};

const handleSaveSession = async (req: Request, res: Response): Promise<void> => {
  try {
    const { exercise_difficulty_id, reps_completed, duration_seconds } = req.body;
    const user_id = req.user!.userId;

    const result = await saveSession(
      exercise_difficulty_id,
      reps_completed,
      user_id,
      duration_seconds
    );
    res.status(201).json(result);
  } catch (error) {
    handleError(error, res);
  }
};

const handleGetMyHistory = async (req: Request, res: Response): Promise<void> => {
  try {
    const user_id = req.user!.userId;
    const result = await getMyHistory(user_id);
    res.status(200).json(result);
  } catch (error) {
    handleError(error, res);
  }
};
export { handleSaveSession, handleGetMyHistory };
