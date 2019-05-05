import pino from 'pino'
import Sentry from './sentry.js'
import config from '../config'

export const logger = pino()

export const logError = (err, prefix) => {
  if (!err) return
  if (config.isProd) Sentry.captureException(err)

  logger.error(`${prefix || ''}${err.message}`)
}
