import { app } from './app';
import { env } from './env';

const server = async () => {
  try {
    await app.listen({ port: env.PORT });
    console.log('Server is running');
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

server();
