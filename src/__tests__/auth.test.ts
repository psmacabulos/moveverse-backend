import request from 'supertest';
import app from '../app';
import { pool } from '../config/db';

afterAll(async () => {
  await pool.query('DELETE  FROM users WHERE email = $1', ['cap@gmail.com']);
  await pool.end();
});

describe('POST /v1/auth/register', () => {
  it('returns 201 with token and user on valid data', async () => {
    const res = await request(app).post('/v1/auth/register').send({
      username: 'Patrick',
      email: 'cap@gmail.com',
      password: 'password123',
    });
    expect(res.status).toBe(201);
    expect(res.body.token).toBeDefined();
    expect(res.body.user.email).toBe('cap@gmail.com');
  });
  it('returns 409 on duplicate email', async () => {
    await request(app).post('/v1/auth/register').send({
      username: 'Patrick',
      email: 'cap@gmail.com',
      password: 'password123',
    });

    const res = await request(app).post('/v1/auth/register').send({
      username: 'Patrick2',
      email: 'cap@gmail.com',
      password: 'password123',
    });

    expect(res.status).toBe(409);
    expect(res.body.error).toBeDefined();
  });

  it('returns 409 on duplicate username', async () => {
    await request(app).post('/v1/auth/register').send({
      username: 'Patrick',
      email: 'cap@gmail.com',
      password: 'password123',
    });

    const res = await request(app).post('/v1/auth/register').send({
      username: 'Patrick',
      email: 'cap2@gmail.com',
      password: 'password123',
    });

    expect(res.status).toBe(409);
    expect(res.body.error).toBeDefined();
  });
});

describe('POST /v1/auth/login', () => {
  it('returns 200 with token on valid credentials', async () => {
    await request(app).post('/v1/auth/register').send({
      username: 'Patrick',
      email: 'cap@gmail.com',
      password: 'password123',
    });

    const res = await request(app).post('/v1/auth/login').send({
      email: 'cap@gmail.com',
      password: 'password123',
    });

    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
  });

  it('returns 401 on wrong password', async () => {
    await request(app).post('/v1/auth/register').send({
      username: 'Patrick',
      email: 'cap@gmail.com',
      password: 'password123',
    });

    const res = await request(app).post('/v1/auth/login').send({
      email: 'cap@gmail.com',
      password: 'wrongpassword',
    });

    expect(res.status).toBe(401);
    expect(res.body.error).toBeDefined();
  });

  it('returns 401 on unknown email', async () => {
    const res = await request(app).post('/v1/auth/login').send({
      email: 'nobody@test.com',
      password: 'password123',
    });

    expect(res.status).toBe(401);
    expect(res.body.error).toBeDefined();
  });
});
