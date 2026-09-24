jest.mock('../src/db', () => ({
  pool: {
    query: jest.fn().mockResolvedValue({ rows: [] }),
    totalCount: 1,
    idleCount: 1,
    waitingCount: 0
  }
}));

import request from 'supertest';
import { app } from '../src/app';

test('health endpoint reports BFF status', async () => {
  const response = await request(app).get('/health');
  expect(response.status).toBe(200);
  expect(response.body.service).toBe('datalens-bff');
});

test('dashboard validates date format', async () => {
  const response = await request(app)
    .get('/api/dashboard?from=bad&to=2026-01-31');

  expect(response.status).toBe(400);
});
