import { FastifyInstance, RouteOptions } from 'fastify'
import { ReactionsService } from './reactions-service'

const reactionsService = new ReactionsService()

export default async function router(fastify: FastifyInstance, options: RouteOptions, next: any): Promise<void> {
  fastify.get('/reactions/:date', await reactionsService.fetchReactionsByPostCreationDate.bind(reactionsService))
  fastify.post('/reactions/:date', await reactionsService.incrementSpecifiedReaction.bind(reactionsService))
  next()
}
