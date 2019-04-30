import GetOnBrd from '@chilesh/getonbrd-scraper'

import { logError } from '../../../lib/logger.js'
import { defaultClient as redis } from '../../../lib/redis.js'
import { CACHE_COMPANIES_KEY } from '../constants.js'

export default async (msg, ch) => {
  try {
    const companyUrl = JSON.parse(msg.content.toString())
    const exists = await redis.hexists(CACHE_COMPANIES_KEY, companyUrl)

    if (!exists) {
      const gob = await GetOnBrd()
      const companyInfo = await gob.getCompanyProfile(companyUrl)
      await redis.hsetJson(CACHE_COMPANIES_KEY, companyUrl, companyInfo)
    }

    ch.ack(msg)
  } catch (err) {
    logError(CACHE_COMPANIES_KEY, err)

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
