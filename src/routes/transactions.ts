import { randomUUID } from 'node:crypto';

import { FastifyInstance } from 'fastify';

import {
  getTransactionSchema,
  transactionSchema,
} from '../schemas/transactionSchema';
import { db } from '../database';

export const transactionsRoutes = async (app: FastifyInstance) => {
  app.post('/', async (request, reply) => {
    try {
      const { amount, title, type, session_id } = transactionSchema.parse(
        request.body,
      );

      await db('transactions').insert({
        id: randomUUID(),
        title: title,
        amount: type === 'debit' ? amount : amount * -1,
        session_id: session_id,
      });

      return reply.code(201).send();
    } catch (error) {
      return reply.code(401).send(error);
    }
  });

  app.get('/', async (request, reply) => {
    const transactions = await db('transactions').select();

    reply.code(204).send(transactions);
  });

  app.get('/:id', async (request, reply) => {
    const { id } = getTransactionSchema.parse(request.params);
    const transaction = await db('transactions').select('*').where('id', id);

    reply.code(204).send(transaction);
  });
};
