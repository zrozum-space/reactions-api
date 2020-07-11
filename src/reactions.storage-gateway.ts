import { Reactions } from 'reactions.type'
import * as redis from 'redis'
import { promisify } from 'util'

const redisClient = redis.createClient({
  host: '127.0.0.1',
  port: 6379,
})

// redisClient.auth('pass')

export class ReactionsStorageGateway {
  public async save(creationDate: string, userAddress: string, reaction: string): Promise<void> {
    const articleReactions = await this.fetchAll(creationDate)

    this.saveAllReactions(articleReactions, creationDate, reaction)
    this.saveUserReaction(userAddress, creationDate, reaction)
  }

  private saveAllReactions(articleReactions: Reactions, creationDate: string, reactionToIncrement: string): void {
    const key = `article_${creationDate}`
    redisClient.set(
      key,
      JSON.stringify({ ...articleReactions, [reactionToIncrement]: articleReactions[reactionToIncrement] += 1 }),
      'EX',
      60,
    )
    redisClient.persist(key)
  }

  private saveUserReaction(userAddress: string, creationDate: string, reaction: string): void {
    const key = `${userAddress}_${creationDate}`
    redisClient.set(key, reaction, 'EX', 60)
    redisClient.persist(key)
  }

  public async fetchAll(creationDate: string): Promise<Reactions> {
    const results = await this.fetch(`article_${creationDate}`)
    if (!results) {
      return { fire: 0, hurray: 0, love: 0 }
    }
    return JSON.parse(results)
  }

  public async fetchUserReaction(userAddress: string, creationDate: string): Promise<string> {
    return this.fetch(`${userAddress}_${creationDate}`)
  }

  private async fetch(key): Promise<any> {
    const invokeAsynchronous = promisify(redisClient.get).bind(redisClient)
    return invokeAsynchronous(key)
  }
}
