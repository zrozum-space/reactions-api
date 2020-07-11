import { FastifyReply, FastifyRequest } from 'fastify'
import { ReactionsStorageGateway } from 'reactions.storage-gateway'
import { Reactions } from 'reactions.type'

const storageGateway = new ReactionsStorageGateway()

export class ReactionsService {
  public async fetchReactionsByPostCreationDate(request: FastifyRequest, reply: FastifyReply<any>): Promise<void> {
    const {
      params: { date },
      ip,
    } = request
    const reactions: Reactions = await storageGateway.fetchAll(date)
    const userReaction: string = await storageGateway.fetchUserReaction(ip, date)
    reply.header('Content-Type', 'application/json; charset=utf-8').send({ reactions, userReaction })
  }

  public async incrementSpecifiedReaction(request: FastifyRequest, reply: FastifyReply<any>): Promise<void> {
    const {
      ip,
      params: { date },
      body: { reaction },
    } = request

    if (!this.isSatisfiedByReactionsType(reaction)) {
      reply
        .header('Content-Type', 'application/json; charset=utf-8')
        .status(400)
        .send({ message: 'Passed reaction did not pass validation' })
      return
    }

    await storageGateway.save(date, ip, reaction)
    reply.header('Content-Type', 'application/json; charset=utf-8').status(204).send()
  }

  private isSatisfiedByReactionsType(value: string): boolean {
    const availableLiterals = ['love', 'hurray', 'fire']
    return availableLiterals.includes(value)
  }
}
