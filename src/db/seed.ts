// Import the pool
import { log } from 'console';
import { pool } from '../config/db';

// Seed the parent table in our case the exercises table
const seedExercises = async (): Promise<void> => {
  await pool.query(
    `INSERT INTO exercises (name, description, calories_per_rep, is_active)
        VALUES($1, $2, $3, $4)
        ON CONFLICT (name) DO NOTHING
        `,
    ['Squat', 'A lower body exercise targeting quads, hamstrings, and glutes', 0.32, true]
  );
  console.log('Exercise table seeded successfully!');
};

const seedExerciseDifficulties = async (): Promise<void> => {
  // Since Exercise id of squat is needed Select if first
  const result = await pool.query(`SELECT id FROM exercises WHERE name = $1`, ['Squat']);
  const squatId = result.rows[0].id;
  console.log(`The id of the exercise Squat is ${squatId}`);

  // Add the defined difficulty for Squats
  await pool.query(
    `INSERT INTO exercise_difficulties(exercise_id, level_name, target_reps, score_multiplier)
        VALUES ($1, $2, $3, $4)
        ON CONFLICT (exercise_id, level_name) DO NOTHING`,
    [squatId, 'Easy', 10, 1.0]
  );
  await pool.query(
    `INSERT INTO exercise_difficulties(exercise_id, level_name, target_reps, score_multiplier)
        VALUES ($1, $2, $3, $4)
        ON CONFLICT (exercise_id, level_name) DO NOTHING`,
    [squatId, 'Medium', 20, 1.5]
  );
  await pool.query(
    `INSERT INTO exercise_difficulties(exercise_id, level_name, target_reps, score_multiplier)
        VALUES ($1, $2, $3, $4)
        ON CONFLICT (exercise_id, level_name) DO NOTHING`,
    [squatId, 'Hard', 40, 2.0]
  );
  console.log('Exercise Difficulties table seeded successfully!');
};

const runSeed = async (): Promise<void> => {
  console.log(`Seeding exercises...`);
  await seedExercises();

  console.log(`Seeding exercise_difficulties...`);
  await seedExerciseDifficulties();

  await pool.end();
  process.exit(0);
};

runSeed().catch((error) => {
  console.error('Seed failed:', error);
  process.exit(1);
});
