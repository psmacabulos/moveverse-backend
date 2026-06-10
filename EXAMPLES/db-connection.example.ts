/**
 * EXAMPLE FILE — Database Connection Pool
 * Context: a fake "library" app. Not your actual code.
 * Use this as a reference while writing src/config/db.ts
 *
 * Official docs: https://node-postgres.com/apis/pool
 */

// Step 1 — Import the Pool class from the 'pg' library.
// Pool manages multiple database connections for you automatically.
// You only ever need one Pool instance for the whole app.
import { Pool } from 'pg';

// Step 2 — Create the pool.
// You pass a config object with five values that tell PostgreSQL
// which server to connect to, which database, and who you are.
const pool = new Pool({
  // The hostname of the PostgreSQL server.
  // In Docker this is the service name (e.g. 'db').
  // Locally without Docker this would be 'localhost'.
  host: process.env.DB_HOST,

  // The port PostgreSQL listens on. Default is always 5432.
  // process.env always gives you a STRING — "5432".
  // Pool expects a NUMBER, so we wrap it with Number().
  port: Number(process.env.DB_PORT),

  // The name of the specific database to connect to.
  // PostgreSQL can host many databases on one server.
  database: process.env.DB_NAME,

  // The PostgreSQL user to authenticate as.
  user: process.env.DB_USER,

  // The password for that user.
  password: process.env.DB_PASSWORD,
});

// Step 3 — Create a function that TESTS the connection.
// This is called once at app startup (in index.ts).
// If the database is unreachable, we want to know immediately —
// not silently run an app that can't store any data.
const connectDB = async (): Promise<void> => {
  try {
    // pool.connect() borrows ONE client from the pool.
    // This forces an actual TCP connection to be made right now.
    const client = await pool.connect();

    // If we get here, the connection succeeded.
    console.log('Database connected successfully');

    // IMPORTANT: always release the client back to the pool.
    // If you forget this, that connection is gone forever —
    // the pool shrinks by one with every startup and eventually
    // your app runs out of connections.
    client.release();
  } catch (error) {
    // Something went wrong — wrong password, wrong host,
    // database doesn't exist, Docker not running, etc.
    console.error('Database connection failed:', error);

    // process.exit(1) shuts the app down immediately with an error code.
    // '1' means "exited with an error" (0 means clean exit).
    // We do this because there is no point running a backend
    // that cannot talk to its database.
    process.exit(1);
  }
};

// Step 4 — Export both things.
// 'pool'      → imported by every model file to run queries
// 'connectDB' → imported by index.ts and called once at startup
export { pool, connectDB };

// =============================================================
// HOW MODELS WILL USE THIS POOL (preview — you'll write this later)
// =============================================================

// In a model file (e.g. src/models/book.model.ts):
//
//   import { pool } from '../config/db';
//
//   export const getAllBooks = async () => {
//     const result = await pool.query('SELECT * FROM books');
//     return result.rows;   // result.rows is the array of row objects
//   };
//
// pool.query() automatically:
//   1. Borrows a connection from the pool
//   2. Runs the SQL
//   3. Returns the result
//   4. Releases the connection back
// You never call connect() or release() in a model — pool.query() does it for you.

// =============================================================
// HOW index.ts WILL USE connectDB (preview — you'll update this later)
// =============================================================

// In src/index.ts:
//
//   import { connectDB } from './config/db';
//
//   const startServer = async () => {
//     await connectDB();          // test DB first
//     app.listen(PORT, () => {
//       console.log(`Server running on port ${PORT}`);
//     });
//   };
//
//   startServer();
//
// If connectDB() throws, process.exit(1) is called inside it
// and app.listen() never runs. The server only starts if the DB is reachable.
