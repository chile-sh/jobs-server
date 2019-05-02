import _ from 'lodash'
import { open, sendToQueue } from '../../lib/amqplib.js'
import { queues } from './queues/index.js'
import { defaultClient as redis } from '../../lib/redis.js'

import {
  SALARY_STEP,
  SALARY_RANGE,
  QUEUE_GET_SALARIES,
  CACHE_SALARY_RANGE_KEY,
  CACHE_JOBS_QUEUED_KEY
} from './constants.js'

const makeRanges = (from, to, step = SALARY_STEP) =>
  _.times((to - from) / step, num => [
    from + step * num,
    from + step * (num + 1)
  ])

const ranges = makeRanges(...SALARY_RANGE, SALARY_STEP)

const getQueuesInfo = async (ch, allQueues) => {
  const queues = await Promise.all(
    allQueues.map(queue => ch.checkQueue(queue.name))
  )

  return {
    done: queues.every(queue => queue.messageCount === 0),
    queues
  }
}

export const run = async () => {
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

  redis.expire(CACHE_SALARY_RANGE_KEY, 3600 * 4)
  redis.del(CACHE_JOBS_QUEUED_KEY)

  ranges.forEach(range => {
    sendToQueue(ch)(QUEUE_GET_SALARIES, { range, offset: 0 })
  })

  const waitForQueuesToEnd = (interval = 500) =>
    new Promise(resolve => {
      const check = async done => {
        const status = await getQueuesInfo(ch, allQueues)
        console.log(status)

        if (done) return resolve()
        if (!status.done) return setTimeout(check, interval)

        setTimeout(() => check(true), 2000)
      }

      check()
    })

  waitForQueuesToEnd().then(async () => {
    console.log('deleting queues!')
    await Promise.all(allQueues.map(q => ch.deleteQueue(q.name)))
    redis.del(CACHE_JOBS_QUEUED_KEY)
    console.log('done!')
  })
}

run()
