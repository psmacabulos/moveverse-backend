/**
 * EXAMPLE FILE — Seed Runner
 * Context: a fake "library" app. Not your actual code.
 * Use this as a reference while writing src/db/seed.ts
 *
 * REFERENCE DOCS:
 *
 * PostgreSQL INSERT ... ON CONFLICT (idempotent inserts)
 *   https://www.postgresql.org/docs/current/sql-insert.html#SQL-ON-CONFLICT
 *
 * node-postgres pool.query()
 *   https://node-postgres.com/features/queries
 */

import { pool } from '../src/config/db';

// ---------------------------------------------------------------------------
// Seed data is written as plain SQL strings.
// ON CONFLICT (unique_column) DO NOTHING makes every insert idempotent —
// safe to run multiple times without creating duplicates or throwing errors.
// ---------------------------------------------------------------------------

// Step 1 — seed the parent table first (no foreign key dependencies)
const seedAuthors = async (): Promise<void> => {
  // $1, $2, $3 are placeholders — pool.query replaces them with the values array.
  // This prevents SQL injection (never concatenate user input into SQL strings).
  await pool.query(
    `
    INSERT INTO authors (name, country)
    VALUES ($1, $2)
    ON CONFLICT (name) DO NOTHING
    `,
    ['George Orwell', 'United Kingdom']
  );

  await pool.query(
    `
    INSERT INTO authors (name, country)
    VALUES ($1, $2)
    ON CONFLICT (name) DO NOTHING
    `,
    ['Frank Herbert', 'United States']
  );
};

// Step 2 — seed the child table (depends on authors existing first)
const seedBooks = async (): Promise<void> => {
  // When a child row references a parent by ID, you need the parent's ID first.
  // Use a SELECT to fetch it — don't hardcode UUIDs.
  const result = await pool.query(
    `SELECT id FROM authors WHERE name = $1`,
    ['George Orwell']
  );

  // result.rows is an array of objects. result.rows[0] is the first row.
  // If the author doesn't exist (e.g. seed ran in wrong order), this will throw.
  const orwellId = result.rows[0].id;

  await pool.query(
    `
    INSERT INTO books (title, author_id, published_year)
    VALUES ($1, $2, $3)
    ON CONFLICT (title) DO NOTHING
    `,
    ['1984', orwellId, 1949]
  );

  await pool.query(
    `
    INSERT INTO books (title, author_id, published_year)
    VALUES ($1, $2, $3)
    ON CONFLICT (title) DO NOTHING
    `,
    ['Animal Farm', orwellId, 1945]
  );
};

// ---------------------------------------------------------------------------
// Main function — runs seeders in dependency order.
// Parent tables first, child tables after.
// ---------------------------------------------------------------------------
const runSeed = async (): Promise<void> => {
  console.log('Seeding authors...');
  await seedAuthors();

  console.log('Seeding books...');
  await seedBooks();

  console.log('Seed complete.');

  await pool.end();
  process.exit(0);
};

runSeed().catch((error) => {
  console.error('Seed failed:', error);
  process.exit(1);
});
