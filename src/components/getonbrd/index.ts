import _ from 'lodash'
import { open, sendToQueue, waitForQueuesToEnd } from '../../lib/amqplib'
import { queues } from './queues/index'
import { defaultClient as redis } from '../../lib/redis'
import { logger } from '../../lib/logger'

import {
  SALARY_STEP,
  SALARY_RANGE,
  QUEUE_GET_SALARIES,
  CACHE_SALARY_RANGE_KEY,
  CACHE_JOBS_QUEUED_KEY,
  CACHE_SALARIES_MAP_KEY,
  CACHE_COMPANIES_KEY,
  CACHE_JOBS_MAP_KEY,
  SOURCE_NAME
} from './constants'

const makeRanges = (from?: number, to?: number, step: number = SALARY_STEP) =>
  _.times((to - from) / step, (num: number) => [
    from + step * num,
    from + step * (num + 1)
  ])

const ranges = makeRanges(...SALARY_RANGE, SALARY_STEP)

export const run = async (onStatus: Function, onEnd: Function) => {
  const conn = await open
  const ch = await conn.createChannel()

  const allQueues = Object.keys(queues).map(k => queues[k])

  await Promise.all(
    allQueues.map(async q => {
      await ch.assertQueue(q.name)
      await ch.purgeQueue(q.name)

      q.run()
    })
  )

  redis.expire(CACHE_COMPANIES_KEY, 3600 * 24 * 7) // one week
  redis.expire(CACHE_JOBS_MAP_KEY, 3600 * 24 * 2) // 2 days
  redis.expire(CACHE_SALARY_RANGE_KEY, 3600 * 4) // 4 hours

  redis.del(CACHE_JOBS_QUEUED_KEY)
  redis.del(CACHE_SALARIES_MAP_KEY)

  ranges.forEach(range => {
    sendToQueue(ch)(QUEUE_GET_SALARIES, { range, offset: 0 })
  })

  return waitForQueuesToEnd(ch, allQueues, {
    onStatus,
    onEnd: async () => {
      logger.info(`${SOURCE_NAME} queues finished! Cleaning up...`)

      await Promise.all(allQueues.map(q => ch.deleteQueue(q.name)))
      await redis.del(CACHE_JOBS_QUEUED_KEY)

      logger.info(
        `${allQueues
          .map(q => q.name)
          .join(', ')} queues, and ${CACHE_JOBS_QUEUED_KEY} key removed`
      )

      logger.info(`${SOURCE_NAME}: process done!`)

      _.isFunction(onEnd) && onEnd()
    }
  })
}
