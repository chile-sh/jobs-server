import Redis from 'ioredis'

import config from '../config'
import { logError } from './logger'

interface JsonRedis extends Redis.Redis {
  hsetJson?(key: string, field: string, val: any): Promise<any>
  hgetJson?(kwy: string, field: string): Promise<any>
}

const createClient = (opts = {}): JsonRedis => {
  const client: JsonRedis = new Redis({
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
    if (!str) {
      return str
    }

    try {
      return JSON.parse(str)
    } catch (err) {
      return str
    }
  }

  client.on('error', logError)

  return client
}

export const defaultClient = createClient()

export default createClient
