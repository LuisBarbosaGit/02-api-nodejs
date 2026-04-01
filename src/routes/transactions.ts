import { randomUUID } from 'node:crypto';

import { FastifyInstance } from 'fastify';

import {
  getTransactionSchema,
  transactionSchema,
} from '../schemas/transactionSchema';
import { db } from '../database';
import { checkSessionId } from '../middlewares/check-session-id';

export const transactionsRoutes = async (app: FastifyInstance) => {
  app.post('/', async (request, reply) => {
    try {
      const { amount, title, type } = transactionSchema.parse(request.body);

      let sessionId = request.cookies.sessionId;

      if (!sessionId) {
        sessionId = randomUUID();
        reply.cookie('sessionId', sessionId, {
          path: '/',
          maxAge: 1000 * 60 * 60 * 2,
        });
      }

      await db('transactions').insert({
        id: randomUUID(),
        title: title,
        amount: type === 'debit' ? amount : amount * -1,
        session_id: sessionId,
      });

      return reply.code(201).send();
    } catch (error) {
      return reply.code(401).send(error);
    }
  });

  app.get(
    '/',
    {
      preHandler: [checkSessionId],
    },
    async (request, reply) => {
      const { sessionId } = request.cookies;

      const transactions = await db('transactions')
        .select()
        .where('session_id', sessionId);
      console.log(transactions);

      reply.send(transactions);
    },
  );

  app.get(
    '/:id',
    {
      preHandler: [checkSessionId],
    },
    async (request, reply) => {
      const { id } = getTransactionSchema.parse(request.params);
      const { sessionId } = request.cookies;

      const transaction = await db('transactions').select('*').where({
        id,
        session_id: sessionId,
      });

      reply.send(transaction);
    },
  );

  app.get(
    '/summary',
    {
      preHandler: [checkSessionId],
    },
    async (request, reply) => {
      const { sessionId } = request.cookies;

      const summary = await db('transactions')
        .where('session_id', sessionId)
        .sum('amount', { as: 'amount' })
        .first();

      return reply.send(summary);
    },
  );
};
