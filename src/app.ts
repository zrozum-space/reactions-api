import * as fastify from "fastify";
import { IncomingMessage, Server, ServerResponse } from "http";
import router from "./router";

const SERVER_PORT = 3000;
const serverOptions: fastify.ServerOptions = {
  logger: process.env.NODE_ENV === "development"
};

const app: fastify.FastifyInstance<
  Server,
  IncomingMessage,
  ServerResponse
> = fastify(serverOptions);

app.register(router);
app.listen(SERVER_PORT);
console.log(`Fastify server running on port ${SERVER_PORT}`);

export default app;
