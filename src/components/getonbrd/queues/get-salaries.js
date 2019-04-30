import GetOnBrd from '@chilesh/getonbrd-scraper'
import _ from 'lodash'

import { logError } from '../../../lib/logger.js'
import { sendToQueue } from '../../../lib/amqplib.js'
import { defaultClient as redis } from '../../../lib/redis.js'
import {
  QUEUE_GET_SALARIES,
  QUEUE_GET_JOBS,
  QUEUE_GET_COMPANIES,
  CACHE_SALARIES_MAP_KEY,
  CACHE_JOBS_MAP_KEY,
  CACHE_SESSION_KEY
} from '../constants.js'

const minMax = arr => [_.min(arr), _.max(arr)]

const gob = (async () => {
  const session = await redis.get(CACHE_SESSION_KEY)
  return GetOnBrd(session)
})()

export default async (msg, ch) => {
  try {
    const item = JSON.parse(msg.content.toString())
    const [from, to] = item.range

    const { urls, next } = await (await gob).getJobsBySalary(
      from,
      to,
      item.offset
    )

    await Promise.all(
      urls.map(async url => {
        const prev = await redis.hgetJson(CACHE_SALARIES_MAP_KEY, url)

        // get-jobs queue
        const jobExists = await redis.hgetJson(CACHE_JOBS_MAP_KEY, url)
        if (!jobExists) {
          sendToQueue(ch)(QUEUE_GET_JOBS, url)
        } else {
          sendToQueue(ch)(QUEUE_GET_COMPANIES, jobExists.company.url)
        }

        return redis.hsetJson(
          CACHE_SALARIES_MAP_KEY,
          url,
          prev ? minMax([...prev, ...item.range]) : item.range
        )
      })
    )

    if (next) {
      sendToQueue(ch)(QUEUE_GET_SALARIES, {
        range: item.range,
        offset: item.offset + 25
      })
    }

    ch.ack(msg)
  } catch (err) {
    logError(CACHE_SALARIES_MAP_KEY, err)

    if (err.response) {
      switch (err.response.statusCode) {
        case 404:
        case 500:
          return ch.reject(msg, false)
      }
    }

    ch.nack(msg)
  }
}
