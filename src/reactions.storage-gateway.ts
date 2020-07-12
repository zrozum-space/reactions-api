import * as redis from 'redis'
import { promisify } from 'util'
import { EnvironmentVariables } from './environment-variables'
import { Reactions } from './reactions.type'

const redisClient = redis.createClient({
  host: EnvironmentVariables.REDIS_ADDRESS,
  auth_pass: EnvironmentVariables.REDIS_PASS,
  port: 6379,
})

export class ReactionsStorageGateway {
  public saveAllReactions(creationDate: string, payload: Reactions): void {
    const key = `article_${creationDate}`
    redisClient.set(key, JSON.stringify(payload), 'EX', 60)
    redisClient.persist(key)
  }

  public saveUserReaction(creationDate: string, userAddress: string, reaction: string): void {
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
