import { afterAll, beforeAll, expect, test } from 'vitest';
import request from 'supertest';

import { app } from '../app';

beforeAll(async () => {
  await app.ready();
});

afterAll(async () => {
  await app.close()
})

test('create a new transaction', async () => {
  const response = await request(app.server).post('/transactions').send({
    title: 'teste',
    amount: 1000,
    type: 'credit',
  });

  expect(response.statusCode).equal(201);
});
