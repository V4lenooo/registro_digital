import { describe, it, expect, beforeEach, vi as jest } from 'vitest';
const request = require('supertest');
const app = require('../src/app');

// Mock de la DB para no necesitar MySQL en los tests
jest.mock('../src/config/db', () => ({
  query: jest.fn(),
}));

const db = require('../src/config/db');

// ─── Tests de autenticación ───────────────────────────────────────────────────

describe('POST /api/auth/register', () => {
  beforeEach(() => jest.clearAllMocks());

  it('debería registrar un usuario nuevo', async () => {
    db.query
      .mockResolvedValueOnce([[]])               // findByEmail → no existe
      .mockResolvedValueOnce([{ insertId: 1 }]); // create

    const res = await request(app)
      .post('/api/auth/register')
      .send({ name: 'María', email: 'maria@test.com', password: 'secret123' });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.token).toBeDefined();
    expect(res.body.user.email).toBe('maria@test.com');
  });

  it('debería rechazar si el email ya existe', async () => {
    db.query.mockResolvedValueOnce([[{ id: 1, email: 'maria@test.com' }]]);

    const res = await request(app)
      .post('/api/auth/register')
      .send({ name: 'María', email: 'maria@test.com', password: 'secret123' });

    expect(res.status).toBe(409);
    expect(res.body.success).toBe(false);
  });

  it('debería rechazar si faltan campos', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ email: 'maria@test.com' }); // sin name ni password

    expect(res.status).toBe(400);
  });

  it('debería rechazar contraseña menor a 6 caracteres', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ name: 'María', email: 'maria@test.com', password: '123' });

    expect(res.status).toBe(400);
  });
});

describe('POST /api/auth/login', () => {
  const bcrypt = require('bcryptjs');

  beforeEach(() => jest.clearAllMocks());

  it('debería loguear un usuario con credenciales correctas', async () => {
    const hashedPassword = await bcrypt.hash('secret123', 10);

    db.query.mockResolvedValueOnce([[{
      id: 1, name: 'María', email: 'maria@test.com',
      password_hash: hashedPassword, role: 'student',
    }]]);

    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'maria@test.com', password: 'secret123' });

    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
    expect(res.body.user.role).toBe('student');
  });

  it('debería rechazar con contraseña incorrecta', async () => {
    const hashedPassword = await bcrypt.hash('secret123', 10);

    db.query.mockResolvedValueOnce([[{
      id: 1, email: 'maria@test.com', password_hash: hashedPassword, role: 'student',
    }]]);

    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'maria@test.com', password: 'wrongpassword' });

    expect(res.status).toBe(401);
  });

  it('debería rechazar si el usuario no existe', async () => {
    db.query.mockResolvedValueOnce([[]]); // sin resultados

    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'noexiste@test.com', password: 'secret123' });

    expect(res.status).toBe(401);
  });
});

describe('GET /api/auth/me', () => {
  const jwt = require('jsonwebtoken');
  process.env.JWT_SECRET = 'test_secret';

  it('debería devolver el perfil del usuario autenticado', async () => {
    const token = jwt.sign({ id: 1, email: 'maria@test.com', role: 'student' }, 'test_secret');

    db.query.mockResolvedValueOnce([[{
      id: 1, name: 'María', email: 'maria@test.com', role: 'student',
    }]]);

    const res = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.user.id).toBe(1);
  });

  it('debería rechazar sin token', async () => {
    const res = await request(app).get('/api/auth/me');
    expect(res.status).toBe(401);
  });
});
