import {
  createSession,
  getSessionsByUser,
  findDifficultyById,
  WorkoutSession,
  WorkoutHistoryRow,
} from '../models/workout.model';
import { AppError } from './auth.service';

const saveSession = async (
  exercise_difficulty_id: string,
  reps_completed: number,
  user_id: string,
  duration_seconds: number
): Promise<WorkoutSession> => {
  const difficulty = await findDifficultyById(exercise_difficulty_id);
  if (!difficulty) {
    throw new AppError('Non-existent exercise difficulty id', 404);
  }
  const score = Math.round(difficulty.score_multiplier * reps_completed);
  const calories_burned = difficulty.calories_per_rep * reps_completed;

  const session = await createSession({
    user_id,
    exercise_difficulty_id,
    reps_completed,
    score,
    duration_seconds,
    calories_burned,
  });
  return session;
};

const getMyHistory = async (user_id: string): Promise<WorkoutHistoryRow[]> => {
  return await getSessionsByUser(user_id);
};
export { saveSession, getMyHistory };
