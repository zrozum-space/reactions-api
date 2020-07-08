import { FastifyInstance, RouteOptions } from 'fastify'
import { welcome } from './handlers'

export default function router(fastify: FastifyInstance, options: RouteOptions, next: any): void {
  fastify.get('/', welcome)
  next()
}
