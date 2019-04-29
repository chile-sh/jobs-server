import _ from 'lodash'
import { open, sendToQueue } from '../../lib/amqplib.js'
import { queues } from './queues/index.js'

import {
  SALARY_STEP,
  SALARY_RANGE,
  QUEUE_GET_SALARIES,
  QUEUE_GET_JOBS
} from './constants.js'

const makeRanges = (from, to, step = SALARY_STEP) =>
  _.times((to - from) / step, num => [
    from + step * num,
    from + step * (num + 1)
  ])

const ranges = makeRanges(...SALARY_RANGE, SALARY_STEP)

export const run = async () => {
  const conn = await open
  const ch = await conn.createChannel()

  await ch.assertQueue(QUEUE_GET_JOBS)
  await ch.purgeQueue(QUEUE_GET_JOBS)

  await ch.assertQueue(QUEUE_GET_SALARIES)
  await ch.purgeQueue(QUEUE_GET_SALARIES)

  ranges.forEach(range => {
    sendToQueue(ch)(QUEUE_GET_SALARIES, { range, offset: 0 })
  })

  queues.getSalaries.run()
  queues.getJobs.run()
}
