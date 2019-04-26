import dotenv from 'dotenv'
dotenv.config()

const {
  NODE_ENV,
  PORT = 9000,
  SENTRY_DSN,
  REDIS_HOST = '127.0.0.1',
  REDIS_PASS
} = process.env

export default {
  isProd: NODE_ENV === 'production',
  port: PORT,
  sentry: {
    dsn: SENTRY_DSN
  },

  redis: {
    password: REDIS_PASS,
    host: REDIS_HOST
  },

  rabbitmq: {
    host: 'amqp://localhost:5672'
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
