import { describe, it, expect, beforeEach, vi as jest } from 'vitest';
const request = require('supertest');
const jwt = require('jsonwebtoken');
const path = require('path');
const app = require('../src/app');

process.env.JWT_SECRET = 'test_secret';

jest.mock('../src/config/db', () => ({ query: jest.fn() }));
const db = require('../src/config/db');

const makeToken = (role = 'student') =>
  jwt.sign({ id: 1, email: 'test@test.com', role }, 'test_secret');

describe('GET /api/documents', () => {
  beforeEach(() => jest.clearAllMocks());

  it('debería devolver todos los documentos sin autenticación', async () => {
    db.query.mockResolvedValueOnce([[
      { id: 1, title: 'Parcial Matemática', subject: 'Matemática', type: 'parcial', year: 2024, file_path: 'file.pdf', uploaded_by: 'María' },
    ]]);

    const res = await request(app).get('/api/documents');

    expect(res.status).toBe(200);
    expect(res.body.documents).toHaveLength(1);
    expect(res.body.documents[0].downloadUrl).toBeDefined();
  });

  it('debería filtrar por materia', async () => {
    db.query.mockResolvedValueOnce([[
      { id: 2, title: 'Guía Física', subject: 'Física', type: 'guia', year: 2024, file_path: 'guia.pdf', uploaded_by: 'Juan' },
    ]]);

    const res = await request(app).get('/api/documents?subject=Física');

    expect(res.status).toBe(200);
    expect(res.body.documents[0].subject).toBe('Física');
  });
});

describe('POST /api/documents', () => {
  beforeEach(() => jest.clearAllMocks());

  it('debería subir un documento autenticado', async () => {
    db.query
      .mockResolvedValueOnce([{ insertId: 5 }])   // INSERT
      .mockResolvedValueOnce([[{ id: 5, title: 'Parcial', subject: 'Mate', type: 'parcial', year: 2024, file_path: 'f.pdf', uploaded_by: 'María' }]]); // findById

    const token = makeToken();
    const testFile = path.join(__dirname, 'fixtures', 'test.pdf');

    // Creamos un fixture mínimo
    const fs = require('fs');
    fs.mkdirSync(path.dirname(testFile), { recursive: true });
    if (!fs.existsSync(testFile)) fs.writeFileSync(testFile, '%PDF-1.4 test');

    const res = await request(app)
      .post('/api/documents')
      .set('Authorization', `Bearer ${token}`)
      .attach('file', testFile)
      .field('title', 'Parcial Mate')
      .field('subject', 'Matemática')
      .field('type', 'parcial')
      .field('year', '2024');

    expect(res.status).toBe(201);
    expect(res.body.document).toBeDefined();
  });

  it('debería rechazar sin autenticación', async () => {
    const res = await request(app)
      .post('/api/documents')
      .field('title', 'Sin login');

    expect(res.status).toBe(401);
  });

  it('debería rechazar tipo inválido', async () => {
    const token = makeToken();
    const res = await request(app)
      .post('/api/documents')
      .set('Authorization', `Bearer ${token}`)
      .field('title', 'Test')
      .field('subject', 'Mate')
      .field('type', 'INVALIDO')
      .field('year', '2024');

    expect(res.status).toBe(400);
  });
});

describe('DELETE /api/documents/:id', () => {
  beforeEach(() => jest.clearAllMocks());

  it('debería borrar el documento si sos el dueño', async () => {
    db.query
      .mockResolvedValueOnce([[{ id: 1, user_id: 1, file_path: 'archivo.pdf', uploaded_by: 'Me' }]]) // findById
      .mockResolvedValueOnce([{ affectedRows: 1 }]); // delete

    const token = makeToken();
    const res = await request(app)
      .delete('/api/documents/1')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it('debería denegar si no sos el dueño', async () => {
    db.query.mockResolvedValueOnce([[{ id: 1, user_id: 99, file_path: 'archivo.pdf' }]]); // otro dueño

    const token = makeToken('student');
    const res = await request(app)
      .delete('/api/documents/1')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(403);
  });
});
