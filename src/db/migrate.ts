import fs from 'fs';
import path from 'path';
import { pool } from '../config/db';

const runMigrations = async (): Promise<void> => {
  // define the migrations folder
  const migrationsFolder = path.join(__dirname, 'migrations');

  // read the filenames of migration folder
  const files = fs
    .readdirSync(migrationsFolder)
    .filter((file) => file.endsWith('.sql'))
    .sort();

  // loop through the files and run the sql command
  for (const file of files) {
    const sql = fs.readFileSync(path.join(migrationsFolder, file), 'utf-8');
    console.log(`Running migraton : ${file}`);

    // Run the command against the database
    await pool.query(sql);

    console.log(`Completed: ${file}`);
  }

  console.log('All migrations completed successfully');

  // Close the pool and exit the process
  await pool.end();
  process.exit(0);
};

// Call the function and catch any unhandled errors
runMigrations().catch((error) => {
  console.log('Migration failed:', error);
  process.exit(1);
});
