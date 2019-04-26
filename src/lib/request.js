import got from 'got'
import cheerio from 'cheerio'

import createClient from './redis.js'
import { md5 } from '../lib/helpers.js'

const cache = createClient({ db: 1 })

const fromCache = async key => {
  const cached = JSON.parse(await cache.get(key))
  if (!cached) return null

  if (cached.statusCode >= 400) {
    const err = Error(cached.statusCode)
    err.response = cached
    throw err
  }

  return cached
}

const request = async (url, opts = {}) => {
  const { ttl, force, method = 'get' } = opts

  const getOptStr = str => (str ? JSON.stringify(str) : '')

  const toCache = [
    'baseUrl',
    'method',
    'headers',
    'form',
    'json',
    'query',
    'body'
  ]

  const key = md5([url, ...toCache.map(k => getOptStr(opts[k]))].join(';'))

  const cached = await fromCache(key)

  if (!force && cached) return { ...cached, fromCache: true }

  try {
    const instance = got[method.toLowerCase()]
    if (!instance) throw Error(`Invalid method ${method}.`)

    const { body, headers, statusCode } = await instance(url, opts)

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

export const dom = async (...args) => {
  const { body } = await request(...args)
  return body && cheerio.load(body)
}

export const json = async (url, opts = {}) =>
  request(url, { ...opts, json: true })