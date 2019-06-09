import { ApolloServer } from 'apollo-server'

import config from '@/config'
import { logger } from '@common/lib/logger'

import schema from './schema'

import '@common/lib/sentry'
import '@common/lib/db'

const server = new ApolloServer({
  schema,
  playground: config.isDev,
  debug: config.isDev
})

server.listen({ port: config.port }).then(({ url }) => {
  logger.info(`Server ready at ${url}`)
})
