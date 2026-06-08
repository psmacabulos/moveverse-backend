CREATE TABLE IF NOT EXISTS user_achievements(
    user_id UUID NOT NULL REFERENCES users(id),
    achievement_id UUID NOT NULL REFERENCES achievements(id),
    unlocked_at TIMESTAMP NOT NULL DEFAULT NOW(),
    CONSTRAINT primary_key_unique PRIMARY KEY(user_id , achievement_id)
);