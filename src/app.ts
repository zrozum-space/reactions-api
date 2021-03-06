import * as fastify from 'fastify'
import { IncomingMessage, Server, ServerResponse } from 'http'
import router from './router'

const SERVER_PORT = 3000
const serverOptions: fastify.FastifyServerOptions = { logger: true }

const app: fastify.FastifyInstance<Server, IncomingMessage, ServerResponse> = fastify.fastify(serverOptions)

app.register(router)
app.register(require('fastify-cors'), {
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'x-forwarded-for'],
  origin: ['http://localhost:8000', process.env.NODE_ENV === 'development' ? 'http://localhost:8000' : 'https://zrozum.space'],
})
app.listen(SERVER_PORT, '0.0.0.0')

export default app
