import { z } from 'zod';

export const transactionSchema = z.object({
  title: z.string(),
  amount: z.number(),
  type: z.enum(['credit', 'debit']),
  session_id: z.uuid(),
});

export const getTransactionSchema = z.object({
  id: z.uuid(),
});
