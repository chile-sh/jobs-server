import { createQueue } from '@lib/amqplib'
import { onError } from '../helpers'

import getSalariesCb from './get-salaries'
import getCompaniesCb from './get-companies'
import getJobsCb from './get-jobs'

import {
  QUEUE_GET_JOBS,
  QUEUE_GET_SALARIES,
  QUEUE_GET_COMPANIES
} from '../constants'

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
