import GetOnBrd from '@chile-sh/getonbrd-scraper'

import { logError } from '../../../lib/logger.js'
import { defaultClient as redis } from '../../../lib/redis.js'
import { CACHE_JOBS_MAP_KEY } from '../constants.js'

export default async (msg, ch) => {
  try {
    const jobUrl = JSON.parse(msg.content.toString())
    const exists = await redis.hexists(CACHE_JOBS_MAP_KEY, jobUrl)

    if (!exists) {
      const gob = await GetOnBrd()
      const jobInfo = await gob.getJob(jobUrl)
      await redis.hsetJson(CACHE_JOBS_MAP_KEY, jobUrl, jobInfo)
    }

    ch.ack(msg)
  } catch (err) {
    logError(CACHE_JOBS_MAP_KEY, err)

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
