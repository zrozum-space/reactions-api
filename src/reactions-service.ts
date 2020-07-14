import { FastifyReply, FastifyRequest } from 'fastify'
import { ReactionsStorageGateway } from './reactions.storage-gateway'
import { Reactions } from './reactions.type'

const storageGateway = new ReactionsStorageGateway()

export class ReactionsService {
  public async fetchReactionsByPostCreationDate(request: FastifyRequest, reply: FastifyReply<any>): Promise<void> {
    const {
      params: { date },
      headers,
    }: any = request
    const userIp = headers['x-forwarded-for'].split(',')[0]
    const reactions: Reactions = await storageGateway.fetchAll(date)
    const userReaction: string = await storageGateway.fetchUserReaction(userIp, date)
    reply.header('Content-Type', 'application/json; charset=utf-8').send({ reactions, userReaction })
  }

  public async incrementSpecifiedReaction(request: FastifyRequest, reply: FastifyReply<any>): Promise<void> {
    const {
      params: { date },
      body: { reaction },
      headers,
    }: any = request

    if (!this.isSatisfiedByReactionsType(reaction)) {
      reply
        .header('Content-Type', 'application/json; charset=utf-8')
        .status(400)
        .send({ message: 'Passed reaction did not pass validation' })
      return
    }

    const userIp = headers['x-forwarded-for'].split(',')[0]
    const oldUserReaction: string = await storageGateway.fetchUserReaction(userIp, date)
    const allReactions: Reactions = await storageGateway.fetchAll(date)

    storageGateway.saveUserReaction(date, userIp, reaction)

    if (oldUserReaction && oldUserReaction !== reaction) {
      storageGateway.saveAllReactions(date, {
        ...allReactions,
        [oldUserReaction]: allReactions[oldUserReaction] -= 1,
        [reaction]: allReactions[reaction] += 1,
      })
    } else if (!oldUserReaction) {
      storageGateway.saveAllReactions(date, {
        ...allReactions,
        [reaction]: allReactions[reaction] += 1,
      })
    }

    reply.header('Content-Type', 'application/json; charset=utf-8').status(204).send()
  }

  private isSatisfiedByReactionsType(value: string): boolean {
    const availableLiterals = ['love', 'hurray', 'fire']
    return availableLiterals.includes(value)
  }
}
