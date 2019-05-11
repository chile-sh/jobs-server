import winston from 'winston'
import config from '../config'
import Sentry from './sentry'

export const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
})

if (!config.isProd) {
  logger.add(
    new winston.transports.Console({
      format: winston.format.simple()
    })
  )
}

export const logError = (err: Error, prefix?: string) => {
  if (!err) return

  if (config.isProd) {
    Sentry.captureException(err)
  }

  logger.error(`${prefix || ''}${err.message}`)
}
