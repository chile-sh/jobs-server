import Redis from 'ioredis'

import config from '@/config'
import { logError } from './logger'
import { toSeconds } from './helpers'

interface CustomRedis extends Redis.Redis {
  hsetJson?(key: string, field: string, val: any): Promise<any>
  hgetJson?(key: string, field: string): Promise<any>
  setKeyExp?(
    key: string,
    timeStr: string | number,
    isHash: boolean,
    expThreshold?: string | number
  ): Promise<any>
}

const createClient = (opts = {}): CustomRedis => {
  const client: CustomRedis = new Redis({
    host: config.redis.host,
    password: config.redis.password,
    db: 0,
    keyPrefix: `${config.appName}:`,
    ...opts
  })

  client.hsetJson = (key, field, val) =>
    client.hset(key, field, JSON.stringify(val))

  client.hgetJson = async (key, field) => {
    const str = await client.hget(key, field)
    if (!str) return str

    try {
      return JSON.parse(str)
    } catch (err) {
      return str
    }
  }

  /**
   * Set expiration in seconds for a given redis key
   * If the remaining TTL is lower than the value set on `expThreshold`,
   * it will empty the key/hash.
   *
   * @param key
   * @param timeStr any `ms` lib compatible string, any integer will be in seconds
   * @param isHash
   * @param expThreshold same as timeStr
   *
   * @example
   *  redis.setKeyExp('cache', '1 day', true, 3600)
   */
  client.setKeyExp = async (key, timeStr, isHash, expThreshold = 0) => {
    const create = () =>
      isHash ? client.hset(key, '', '') : client.set(key, '')

    const exists = await client.exists(key)
    if (!exists) await create()

    const ttl = await client.ttl(key)
    if (ttl < toSeconds(expThreshold)) {
      await client.del(key)
      await create()
      return client.expire(key, toSeconds(timeStr))
    }
  }

  client.on('error', logError)

  return client
}

export const defaultClient = createClient()

export default createClient
