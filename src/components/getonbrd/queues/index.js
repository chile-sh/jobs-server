import { createQueue } from '../../../lib/amqplib.js'
import { QUEUE_GET_JOBS, QUEUE_GET_SALARIES } from '../constants.js'

import getSalariesCb from './get-salaries.js'
import getJobsCb from './get-jobs.js'

export const queues = {
  getSalaries: {
    run: () => createQueue(QUEUE_GET_SALARIES, { prefetch: 4 }, getSalariesCb)
  },
  getJobs: {
    run: () =>
      createQueue(
        QUEUE_GET_JOBS,
        { assert: [QUEUE_GET_SALARIES], prefetch: 4 },
        getJobsCb
      )
  }
}
