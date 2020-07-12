require('dotenv').config({ path: `./${process.env.NODE_ENV !== 'production' ? 'production' : 'development'}.env` })

export class EnvironmentVariables {
  private constructor() {}

  public static readonly REDIS_PASS: string = process.env.REDIS_PASS
  public static readonly REDIS_ADDRESS: string = process.env.REDIS_ADDRESS
}
