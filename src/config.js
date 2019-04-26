import dotenv from 'dotenv'

dotenv.config()

const { SENTRY_DSN, NODE_ENV, PORT = 9000 } = process.env

export default {
  isProd: NODE_ENV === 'production',
  port: PORT,
  sentry: {
    dsn: SENTRY_DSN
  }
}
