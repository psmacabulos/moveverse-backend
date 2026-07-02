import { pool } from '../config/db';

interface achievement {
  id: string;
  name: string;
  description: string;
  badge_image: string;
  unlocked_at: Date;
}

// two tables are involved: achievements table and user_achievements table

const getAllAchievements = async (user_id: string): Promise<achievement[]> => {
  const result = await pool.query(`SELECT a.id, a.name, a.description, a.badge_image, 
    ua.unlocked_at
    FROM achievements a
    JOIN user_achievements ua
    ON ua.achievement_id = a.id
    WHERE ua.user_id = $1
    ORDER BY ua.unlocked_at, a.name`);

  console.log(result);
  return result.rows;
};

getAllAchievements('ee46cf85-e169-4126-b8d9-5dceb9a2d114').then((res) => console.log(res));
