import GetOnBrd from '@chile-sh/getonbrd-scraper'

import { defaultClient as redis } from '../../../lib/redis.js'
import { CACHE_COMPANIES_KEY } from '../constants.js'

export default async (msg, ch) => {
  if (!msg) return false

  const companyUrl = JSON.parse(msg.content.toString())
  const exists = await redis.hexists(CACHE_COMPANIES_KEY, companyUrl)

  if (!exists) {
    const gob = await GetOnBrd()
    const companyInfo = await gob.getCompanyProfile(companyUrl)
    await redis.hsetJson(CACHE_COMPANIES_KEY, companyUrl, companyInfo)
  }

  await ch.ack(msg)
}
