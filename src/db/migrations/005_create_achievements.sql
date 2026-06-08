CREATE TABLE IF NOT EXISTS achievements(
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 name VARCHAR(100) UNIQUE NOT NULL,
 description TEXT,
 badge_image TEXT,
 requirement_type VARCHAR(100) NOT NULL,
 requirement_value INTEGER NOT NULL
);