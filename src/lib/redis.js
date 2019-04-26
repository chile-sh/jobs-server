import Redis from 'ioredis'

import sentry from './sentry.js'
import config from '../config.js'

export default opts => {
  const client = new Redis({
    host: config.redis.host,
    password: config.redis.password,
    db: 0,
    ...opts
  })

  client.on('error', err => {
    sentry.captureException(err)
    console.error('Redis error:', err.message)
  })

  return client
}
