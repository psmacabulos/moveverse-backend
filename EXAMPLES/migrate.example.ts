/**
 * EXAMPLE FILE — Migration Runner
 * Context: a fake "library" app. Not your actual code.
 * Use this as a reference while writing src/db/migrate.ts
 *
 * REFERENCE DOCS:
 *
 * Node.js fs module (reading files and folders)
 *   https://nodejs.org/api/fs.html
 *
 * Node.js path module (building file paths)
 *   https://nodejs.org/api/path.html
 *
 * node-postgres pool.query()
 *   https://node-postgres.com/features/queries
 */

import fs from 'fs';
import path from 'path';
import { Pool } from 'pg';

// Import your pool — same pattern as db.ts
const pool = new Pool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

const runMigrations = async (): Promise<void> => {
  // path.join() builds the correct path regardless of OS.
  // __dirname is the folder this file lives in at runtime.
  // '..' goes up one level, then into the migrations folder.
  const migrationsFolder = path.join(__dirname, '..', 'migrations');

  // fs.readdirSync() returns an array of filenames in the folder.
  // .filter() keeps only .sql files — ignores any other files.
  // .sort() ensures they run in alphabetical order (001, 002, 003...).
  const files = fs
    .readdirSync(migrationsFolder)
    .filter((file) => file.endsWith('.sql'))
    .sort();

  // Loop through each file and run it
  for (const file of files) {
    // Build the full path to the file
    const filePath = path.join(migrationsFolder, file);

    // Read the file contents as a UTF-8 string
    // This gives you the raw SQL text, e.g. "CREATE TABLE IF NOT EXISTS ..."
    const sql = fs.readFileSync(filePath, 'utf-8');

    console.log(`Running migration: ${file}`);

    // Run the SQL against the database.
    // pool.query() can execute any SQL string — not just SELECT queries.
    await pool.query(sql);

    console.log(`Completed: ${file}`);
  }

  console.log('All migrations completed successfully.');

  // IMPORTANT: close the pool and exit the process.
  // Without this, the open database connections keep the script
  // running forever — it never returns to your terminal.
  await pool.end();
  process.exit(0);
};

// Call the function and catch any unhandled errors
runMigrations().catch((error) => {
  console.error('Migration failed:', error);
  process.exit(1);
});
