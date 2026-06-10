/**
 * EXAMPLE FILE — bcryptjs usage
 * Context: a fake "library" app. Not your actual code.
 * Use this as a reference while writing the admin seed and auth service.
 *
 * REFERENCE DOCS:
 *
 * bcryptjs npm page
 *   https://www.npmjs.com/package/bcryptjs
 */

import bcrypt from 'bcryptjs';
import { pool } from '../src/config/db';

// ---------------------------------------------------------------------------
// HASHING — used when creating a user (registration or seed)
// ---------------------------------------------------------------------------

const createLibrarian = async (): Promise<void> => {
  // Read credentials from environment variables — never hardcode passwords
  const email = process.env.LIBRARIAN_EMAIL;
  const plainTextPassword = process.env.LIBRARIAN_PASSWORD;

  if (!email || !plainTextPassword) {
    throw new Error('LIBRARIAN_EMAIL and LIBRARIAN_PASSWORD must be set in .env');
  }

  // bcrypt.hash() takes the plain text password and a salt rounds number.
  // Salt rounds = how many times the algorithm runs. 10 is the industry standard.
  // Higher is more secure but slower. 10 takes ~100ms — fast enough for users,
  // slow enough to make brute force attacks impractical.
  const SALT_ROUNDS = 10;
  const passwordHash = await bcrypt.hash(plainTextPassword, SALT_ROUNDS);

  // passwordHash looks like: "$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy"
  // The hash includes the salt embedded inside it — you don't store the salt separately.
  // You store ONLY passwordHash in the database, never the original password.

  await pool.query(
    `INSERT INTO librarians (email, password_hash, role)
     VALUES ($1, $2, $3)
     ON CONFLICT (email) DO NOTHING`,
    [email, passwordHash, 'librarian']
  );

  console.log('Librarian seeded.');
};

// ---------------------------------------------------------------------------
// COMPARING — used when checking a login (auth service, Phase 7)
// ---------------------------------------------------------------------------

const checkPassword = async (plainText: string, storedHash: string): Promise<boolean> => {
  // bcrypt.compare() hashes the plain text the same way and compares the result.
  // You never "decode" a hash — it is a one-way operation.
  // Returns true if they match, false if not.
  const isMatch = await bcrypt.compare(plainText, storedHash);
  return isMatch;
};

// Example usage:
// const valid = await checkPassword('password123', userFromDatabase.password_hash);
// if (!valid) → return 401 Unauthorized
