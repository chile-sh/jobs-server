import { createQueue } from '../../../lib/amqplib.js'
import {
  QUEUE_GET_JOBS,
  QUEUE_GET_SALARIES,
  QUEUE_GET_COMPANIES
} from '../constants.js'

import getSalariesCb from './get-salaries.js'
import getCompaniesCb from './get-companies.js'
import getJobsCb from './get-jobs.js'
import { onError } from '../helpers.js'

export const queues = {
  getSalaries: {
    name: QUEUE_GET_SALARIES,
    run: () =>
      createQueue(QUEUE_GET_SALARIES, { prefetch: 4 }, getSalariesCb, onError)
  },
  getJobs: {
    name: QUEUE_GET_JOBS,
    run: () =>
      createQueue(
        QUEUE_GET_JOBS,
        { assert: [QUEUE_GET_SALARIES], prefetch: 2 },
        getJobsCb,
        onError
      )
  },
  getCompany: {
    name: QUEUE_GET_COMPANIES,
    run: () =>
      createQueue(
        QUEUE_GET_COMPANIES,
        { assert: [QUEUE_GET_JOBS], prefetch: 2 },
        getCompaniesCb,
        onError
      )
  }
}
