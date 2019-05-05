import Redis from 'ioredis'

import config from '../config.js'
import { logError } from './logger.js'

const createClient = (opts = {}) => {
  const client = new Redis({
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