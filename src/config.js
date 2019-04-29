import dotenv from 'dotenv'
dotenv.config()

const {
  NODE_ENV,
  PORT = 3000,
  SENTRY_DSN,
  REDIS_HOST = '127.0.0.1',
  REDIS_PASS,
  RMQ_USER,
  RMQ_PASS
} = process.env

export default {
  isProd: NODE_ENV === 'production',
  appName: 'jobs',
  port: PORT,
  sentry: {
    dsn: SENTRY_DSN
  },

  redis: {
    password: REDIS_PASS,
    host: REDIS_HOST
  },

  rabbitmq: {
    host: 'localhost:5672',
    user: RMQ_USER,
    pass: RMQ_PASS
  },

  knexConfig: {
    development: {
      client: 'postgres',
      useNullAsDefault: true,

      connection: {
        database: 'jobs',
        user: 'postgres',
        password: 'admin'
      },
      pool: {
        min: 2,
        max: 10
      },
      migrations: {
        tableName: 'knex_migrations'
      }
    },

    production: {}
  }
}
