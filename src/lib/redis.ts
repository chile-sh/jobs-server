import Redis from 'ioredis'

import config from '../config'
import { logError } from './logger'

interface CustomRedis extends Redis.Redis {
  hsetJson?(key: string, field: string, val: any): Promise<any>
  hgetJson?(key: string, field: string): Promise<any>
  setKeyExp?(
    key: string,
    seconds: number,
    isHash: boolean,
    expThreshold?: number
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
   * @param seconds
   * @param isHash
   * @param expThreshold EXP in seconds
   *
   * @example
   *  redis.setKeyExp('cache', 3600 * 24, true, 3600)
   */
  client.setKeyExp = async (key, seconds, isHash, expThreshold = 0) => {
    const create = () =>
      isHash ? client.hset(key, '', '') : client.set(key, '')

    const exists = await client.exists(key)
    if (!exists) await create()

    const ttl = await client.ttl(key)
    if (ttl < expThreshold) {
      await client.del(key)
      await create()
      return client.expire(key, seconds)
    }
  }

  client.on('error', logError)

  return client
}

export const defaultClient = createClient()

export default createClient
