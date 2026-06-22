import { getExercises } from '../services/exercise.service';
import { Response, Request } from 'express';
import { AppError } from '../services/auth.service';

const handleError = (error: unknown, res: Response): void => {
  if (error instanceof AppError) {
    res.status(error.statusCode).json({ error: error.message });
    return;
  }
  res.status(500).json({ error: 'Something went wrong' });
};

const handleGetExercises = async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await getExercises();
    res.status(200).json(result);
  } catch (error) {
    handleError(error, res);
  }
};

export { handleGetExercises };
