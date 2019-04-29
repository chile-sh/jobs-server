import { logError } from '../../../lib/logger.js'
import { defaultClient as redis } from '../../../lib/redis.js'
import { sendToQueue } from '../../../lib/amqplib.js'
import { CACHE_JOBS_MAP_KEY, QUEUE_GET_COMPANIES } from '../constants.js'
import { getJob } from '../scraper.js'

export default async (msg, ch) => {
  try {
    const jobUrl = JSON.parse(msg.content.toString())
    const exists = await redis.hexists(CACHE_JOBS_MAP_KEY, jobUrl)

    if (!exists) {
      const jobInfo = await getJob(jobUrl)
      await redis.hsetJson(CACHE_JOBS_MAP_KEY, jobUrl, jobInfo)

      sendToQueue(ch)(QUEUE_GET_COMPANIES, jobInfo.company.url)
    }

    ch.ack(msg)
  } catch (err) {
    logError(err)

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
