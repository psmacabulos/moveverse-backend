/**
 * EXAMPLE FILE — Model layer (database access functions)
 * Context: a fake "library" app. Not your actual code.
 * Use this as a reference while writing src/models/user.model.ts
 *
 * The model is the ONLY layer that talks to the database.
 * It knows SQL and column names. It knows NOTHING about HTTP,
 * passwords, hashing, or JWTs — those belong to higher layers.
 *
 * REFERENCE DOCS:
 *
 * node-postgres queries
 *   https://node-postgres.com/features/queries
 * PostgreSQL RETURNING clause
 *   https://www.postgresql.org/docs/current/dml-returning.html
 */

import { pool } from '../src/config/db';

// ---------------------------------------------------------------------------
// STEP 1 — TYPES
// ---------------------------------------------------------------------------
// The library app has a "members" table created by this migration:
//
//   CREATE TABLE members (
//       id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
//       username      VARCHAR(50) UNIQUE NOT NULL,
//       email         VARCHAR(255) UNIQUE NOT NULL,
//       password_hash TEXT,                -- nullable! (Google-only accounts)
//       google_id     TEXT,
//       role          member_role NOT NULL DEFAULT 'member',  -- enum: member | librarian
//       created_at    TIMESTAMP NOT NULL DEFAULT NOW()
//   );
//
// The interface mirrors the table EXACTLY — same names, snake_case and all.
// TypeScript will NOT verify your SQL actually returns these columns;
// it trusts you. Keep the interface and your SELECT lists visibly in sync.

interface Member {
  id: string; // UUIDs come back from pg as strings
  username: string;
  email: string;
  password_hash: string | null; // null when the account is Google-only
  google_id: string | null;
  role: 'member' | 'librarian'; // matches the Postgres enum values
  created_at: Date; // pg converts TIMESTAMP to a JS Date
}

// A second, NARROWER type for everything that leaves this layer headed
// toward an HTTP response. Omit<> builds a copy of Member with
// password_hash removed. If you accidentally try to return the hash
// from a function typed as SafeMember, the COMPILER stops you.
type SafeMember = Omit<Member, 'password_hash'>;

// ---------------------------------------------------------------------------
// STEP 2 — CREATE (used by the register flow)
// ---------------------------------------------------------------------------

// NOTE the parameter name: passwordHash, not password.
// By the time the model is called, the service has ALREADY bcrypt-hashed
// the password. The model just stores text — it doesn't know it's a hash.
const createMember = async (
  username: string,
  email: string,
  passwordHash: string
): Promise<SafeMember> => {
  // PARAMETERIZED QUERY — the single most important habit in this file.
  // $1, $2, $3 are placeholders. The values travel to PostgreSQL
  // SEPARATELY from the SQL text, so they can never be executed as SQL.
  // A malicious email like  ');DROP TABLE members;--  is stored as a
  // harmless string. NEVER build SQL with string concatenation.
  //
  // RETURNING — Postgres hands back the row it just inserted, in the
  // same round trip. No need for a second SELECT. And because WE choose
  // the column list, we simply leave password_hash out — the returned
  // object is already safe to send up the stack.
  const result = await pool.query<SafeMember>(
    `INSERT INTO members (username, email, password_hash)
     VALUES ($1, $2, $3)
     RETURNING id, username, email, google_id, role, created_at`,
    [username, email, passwordHash]
  );

  // INSERT ... RETURNING always gives exactly one row on success.
  return result.rows[0];
};

// ---------------------------------------------------------------------------
// STEP 3 — FIND BY EMAIL (used by the login flow)
// ---------------------------------------------------------------------------

// This is the ONE function that deliberately returns password_hash.
// The service needs it to run bcrypt.compare() during login.
// That's not a leak — the service uses it and never passes it further up.
const findByEmail = async (email: string): Promise<Member | null> => {
  const result = await pool.query<Member>(
    `SELECT id, username, email, password_hash, google_id, role, created_at
     FROM members
     WHERE email = $1`,
    [email]
  );

  // result.rows is ALWAYS an array. For a lookup that matches nothing,
  // it's an empty array, so rows[0] is undefined.
  // We convert that to null on purpose — "no such member" is a normal,
  // expected outcome (wrong email at login), not an exception.
  // The ?? operator means: "use rows[0] unless it's null/undefined,
  // in which case use null".
  return result.rows[0] ?? null;
};

// ---------------------------------------------------------------------------
// STEP 4 — FIND BY ID (used by the auth middleware)
// ---------------------------------------------------------------------------

// The JWT stores the member's id. On every protected request, the
// middleware decodes the token and calls findById() to load the member
// and attach it to req.user.
//
// Because this result ends up on req.user — and could easily end up in
// a JSON response — we EXCLUDE password_hash from the column list.
// Note the return type is SafeMember | null, not Member | null.
const findById = async (id: string): Promise<SafeMember | null> => {
  const result = await pool.query<SafeMember>(
    `SELECT id, username, email, google_id, role, created_at
     FROM members
     WHERE id = $1`,
    [id]
  );

  return result.rows[0] ?? null;
};

// ---------------------------------------------------------------------------
// STEP 5 — EXPORTS
// ---------------------------------------------------------------------------

export { Member, SafeMember, createMember, findByEmail, findById };

// =============================================================
// WHAT THIS LAYER DOES NOT DO
// =============================================================
//
// - No try/catch around every query. If the database throws, let it
//   bubble up — the service or a global error handler deals with it.
//   The one error the SERVICE will care about is Postgres code '23505'
//   (unique violation — duplicate email/username). Catching it there
//   lets the service translate it into "email already registered".
//
// - No hashing. bcrypt lives in the service (see bcrypt.example.ts).
//
// - No req/res. If you ever find yourself importing Express types
//   into a model file, something has gone wrong with the layering.
//
// =============================================================
// HOW THE SERVICE WILL USE THESE (preview — you'll write this next)
// =============================================================
//
// In src/services/auth.service.ts:
//
//   const register = async (username, email, password) => {
//     const existing = await findByEmail(email);
//     if (existing) throw ...            // already registered
//     const hash = await bcrypt.hash(password, 10);
//     return createMember(username, email, hash);   // SafeMember out
//   };
//
//   const login = async (email, password) => {
//     const member = await findByEmail(email);      // includes the hash
//     if (!member || !member.password_hash) throw ...  // 401
//     const ok = await bcrypt.compare(password, member.password_hash);
//     if (!ok) throw ...                              // 401
//     // sign a JWT with member.id, return token + safe fields only
//   };
