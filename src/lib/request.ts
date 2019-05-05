import cheerio from 'cheerio'
import got from 'got'

import { md5 } from '../lib/helpers.js'
import createClient from './redis.js'

const cache = createClient({ db: 1 })

const fromCache = async (key: string) => {
  const cached = JSON.parse(await cache.get(key))
  if (!cached) {
    return null
  }

  if (cached.statusCode >= 400) {
    const err: any = Error(cached.statusCode)
    err.response = cached
    throw err
  }

  return cached
}

export const request = async (url?: string, opts: any = {}) => {
  const { ttl, force } = opts

  const getOptStr = (str: string) => (str ? JSON.stringify(str) : '')

  const toCache = [
    'baseUrl',
    'method',
    'headers',
    'form',
    'json',
    'query',
    'body'
  ]

  const key = md5([url, ...toCache.map(k => getOptStr(opts[k]))].join())

  const cached = await fromCache(key)

  if (!force && cached) {
    return { ...cached, fromCache: true }
  }

  try {
    const { body, headers, statusCode } = await got(url, opts)
    const data = { body, headers, statusCode }

    ttl && cache.set(key, JSON.stringify(data), 'EX', ttl)

    return data
  } catch (err) {
    if (err.response) {
      const { statusCode, headers, body } = err.response
      if (ttl) {
        cache.set(key, JSON.stringify({ statusCode, headers, body }))
      }
    }

    throw err
  }
}

export const dom = async (...args: [any]) => {
  const { body } = await request(...args)
  return body && cheerio.load(body)
}

export const json = async (url: string, opts = {}) =>
  request(url, { ...opts, json: true })
