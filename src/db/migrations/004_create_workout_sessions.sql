CREATE TABLE IF NOT EXISTS workout_sessions(
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id),
    exercise_difficulty_id UUID NOT NULL REFERENCES exercise_difficulties(id),
    reps_completed INTEGER NOT NULL,
    score INTEGER NOT NULL,
    duration_seconds INTEGER NOT NULL,
    calories_burned DECIMAL(5,2),
    completed_at TIMESTAMP NOT NULL DEFAULT NOW()
);