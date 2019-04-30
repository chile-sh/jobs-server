import pino from 'pino'
import Sentry from './sentry.js'

const logger = pino()

export const logError = (err, prefix) => {
  if (!err) return
  Sentry.captureException(err)
  logger.error(`${prefix || ''}${err.message}`)
}

export default logger
