// Pool manages multiple database connections from the 'pg' library
import { Pool } from 'pg';

// create the pool
const pool = new Pool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT), // port needs to be a number but .env are strings
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

// function that TESTS  the connection

const connectDB = async (): Promise<void> => {
  try {
    // pool.connect() borrows ONE client from the pool.
    const client = await pool.connect();
    console.log('Database connected successfully');
    client.release();
  } catch (error) {
    console.error('Database connection failed:', error);
    process.exit(1);
  }
};

export { pool, connectDB };
