import { FastifyReply, FastifyRequest } from 'fastify'
import { ReactionsStorageGateway } from 'reactions.storage-gateway'
import { Reactions } from 'reactions.type'

const storageGateway = new ReactionsStorageGateway()

export class ReactionsService {
  public async fetchReactionsByPostCreationDate(request: FastifyRequest, reply: FastifyReply<any>): Promise<void> {
    const {
      params: { date },
      ip,
    }: any = request
    const reactions: Reactions = await storageGateway.fetchAll(date)
    const userReaction: string = await storageGateway.fetchUserReaction(ip, date)
    reply.header('Content-Type', 'application/json; charset=utf-8').send({ reactions, userReaction })
  }

  public async incrementSpecifiedReaction(request: FastifyRequest, reply: FastifyReply<any>): Promise<void> {
    const {
      ip,
      params: { date },
      body: { reaction },
    }: any = request

    if (!this.isSatisfiedByReactionsType(reaction)) {
      reply
        .header('Content-Type', 'application/json; charset=utf-8')
        .status(400)
        .send({ message: 'Passed reaction did not pass validation' })
      return
    }

    const oldUserReaction: string = await storageGateway.fetchUserReaction(ip, date)
    const allReactions: Reactions = await storageGateway.fetchAll(date)

    storageGateway.saveUserReaction(date, ip, reaction)

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
