import pino from 'pino'
import config from '../config'
import Sentry from './sentry.js'

export const logger = pino()

export const logError = (err: Error, prefix?: string) => {
  if (!err) {
    return
  }

  if (config.isProd) {
    Sentry.captureException(err)
  }

  logger.error(`${prefix || ''}${err.message}`)
}
