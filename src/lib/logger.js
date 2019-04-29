import pino from 'pino'
import Sentry from './sentry.js'

const logger = pino()

export const logError = err => {
  if (!err) return
  Sentry.captureException(err)
  logger.error(err)
}

export default logger
