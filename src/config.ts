import dotenv from 'dotenv'
dotenv.config()

const {
  NODE_ENV = 'development',
  PORT = 3000,
  SENTRY_DSN,
  REDIS_HOST = '127.0.0.1',
  REDIS_PASS,
  RMQ_HOST = '127.0.0.1',
  RMQ_USER,
  RMQ_PASS,

  GETONBRD_SESSION
} = process.env

export default {
  env: NODE_ENV,
  isProd: NODE_ENV === 'production',
  appName: 'jobs',
  port: Number(PORT),

  bots: {
    getonbrd: {
      session: GETONBRD_SESSION
    }
  },

  sentry: {
    dsn: SENTRY_DSN
  },

  redis: {
    password: REDIS_PASS,
    host: REDIS_HOST
  },

  rabbitmq: {
    host: RMQ_HOST,
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
        password: 'postgres'
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
