import { describe, it, expect, beforeEach, vi as jest } from 'vitest';
const request = require('supertest');
const jwt = require('jsonwebtoken');
const app = require('../src/app');

process.env.JWT_SECRET = 'test_secret';

jest.mock('../src/config/db', () => ({ query: jest.fn() }));
const db = require('../src/config/db');

const makeToken = (role = 'student') =>
  jwt.sign({ id: 1, email: 'test@test.com', role }, 'test_secret');

describe('GET /api/content', () => {
  beforeEach(() => jest.clearAllMocks());

  it('debería devolver todo el contenido sin autenticación', async () => {
    db.query.mockResolvedValueOnce([[
      { id: 1, title: 'Horario Cuatrimestre', category: 'horario', description: 'Lunes 8hs', created_by: 'Admin' },
    ]]);

    const res = await request(app).get('/api/content');

    expect(res.status).toBe(200);
    expect(res.body.content).toHaveLength(1);
  });

  it('debería filtrar por categoría', async () => {
    db.query.mockResolvedValueOnce([[
      { id: 2, title: 'Campus Virtual', category: 'link', url: 'https://campus.edu.ar', created_by: 'Admin' },
    ]]);

    const res = await request(app).get('/api/content?category=link');
    expect(res.status).toBe(200);
  });
});

describe('POST /api/content', () => {
  beforeEach(() => jest.clearAllMocks());

  it('debería crear contenido autenticado', async () => {
    db.query
      .mockResolvedValueOnce([{ insertId: 3 }])
      .mockResolvedValueOnce([[{ id: 3, title: 'Parcial Noviembre', category: 'fecha_importante', description: '15/11', user_id: 1 }]]);

    const token = makeToken();
    const res = await request(app)
      .post('/api/content')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Parcial Noviembre', description: '15/11', category: 'fecha_importante' });

    expect(res.status).toBe(201);
    expect(res.body.content).toBeDefined();
  });

  it('debería rechazar categoría inválida', async () => {
    const token = makeToken();
    const res = await request(app)
      .post('/api/content')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Test', description: 'Desc', category: 'INVALIDA' });

    expect(res.status).toBe(400);
  });

  it('debería rechazar URL inválida', async () => {
    const token = makeToken();
    const res = await request(app)
      .post('/api/content')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Test', description: 'Desc', category: 'link', url: 'no-es-una-url' });

    expect(res.status).toBe(400);
  });

  it('debería rechazar sin autenticación', async () => {
    const res = await request(app)
      .post('/api/content')
      .send({ title: 'Test', description: 'Desc', category: 'aviso' });

    expect(res.status).toBe(401);
  });
});

describe('PUT /api/content/:id', () => {
  beforeEach(() => jest.clearAllMocks());

  it('debería actualizar si sos el creador', async () => {
    db.query
      .mockResolvedValueOnce([[{ id: 1, user_id: 1, title: 'Viejo', description: 'Old', category: 'aviso' }]]) // findById
      .mockResolvedValueOnce([{ affectedRows: 1 }])   // UPDATE
      .mockResolvedValueOnce([[{ id: 1, title: 'Nuevo', description: 'New', category: 'aviso' }]]); // findById post-update

    const token = makeToken();
    const res = await request(app)
      .put('/api/content/1')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Nuevo', description: 'New', category: 'aviso' });

    expect(res.status).toBe(200);
    expect(res.body.content.title).toBe('Nuevo');
  });
});
