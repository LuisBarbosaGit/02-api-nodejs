import { FastifyReply, FastifyRequest } from 'fastify';

export const checkSessionId = (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  const sessionId = request.cookies.sessionId;

  if (!sessionId) {
    reply.code(404).send('Unauthorized');
  }
};
