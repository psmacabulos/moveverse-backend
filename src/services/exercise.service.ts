import { getAllExercises, Exercise } from '../models/exercise.model';

const getExercises = async (): Promise<Exercise[]> => {
  return await getAllExercises();
};

export { getExercises };
