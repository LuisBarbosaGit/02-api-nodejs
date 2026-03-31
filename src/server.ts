import fastify from "fastify";

import { env } from "./env";
import { transactionsRoutes } from "./routes/transactions";

const app = fastify({
  logger: true,
});

const server = async () => {
  try {
    await app.listen({ port: env.PORT });
    console.log("Server is running");
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

server();

app.register(transactionsRoutes, {
  prefix : '/transactions'
});
