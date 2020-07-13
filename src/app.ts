import * as fastify from 'fastify'
import * as fs from 'fs'
import { IncomingMessage, Server, ServerResponse } from 'http'
import router from './router'

const SERVER_PORT = 3000
let serverOptions: fastify.FastifyServerOptions & { https?: any } = { logger: true }

if (process.env.NODE_ENV === 'production') {
  serverOptions = {
    ...serverOptions,
    https: {
      key: fs.readFileSync('key.pem'),
      cert: fs.readFileSync('cert.pem'),
    },
  }
}

const app: fastify.FastifyInstance<Server, IncomingMessage, ServerResponse> = fastify.fastify(serverOptions)

app.register(router)
app.register(require('fastify-cors'), {
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type'],
  origin: ['http://localhost:8000', process.env.NODE_ENV === 'development' ? 'http://localhost:8000' : 'https://zrozum.space'],
})
app.listen(SERVER_PORT, '0.0.0.0')

console.log(`Fastify server running on port ${SERVER_PORT}`)

export default app
