DO $$ BEGIN
  CREATE TYPE exercise_level  AS ENUM ('Easy', 'Medium', 'Hard');
EXCEPTION
  WHEN duplicate_object THEN NULL; -- silently skip if already exists
END $$;

CREATE TABLE IF NOT EXISTS exercise_difficulties(
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    exercise_id UUID NOT NULL REFERENCES exercises(id),
    level_name exercise_level NOT NULL,
    target_reps INTEGER NOT NULL,
    score_multiplier DECIMAL(5,2) NOT NULL,
    CONSTRAINT unique_exercise_level UNIQUE (exercise_id, level_name)
);