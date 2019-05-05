import fastify from 'fastify'
import { logger } from './lib/logger'
import config from './config'
// const { ApolloServer } = require('apollo-server-fastify')

import './lib/sentry'
import './worker'

/*
const server = new ApolloServer({
  typeDefs: [],
  resolvers: []
})

app.register(server.createHandler())
*/

const app = fastify({ logger })

app.listen(config.port, (err, address) => {
  if (err) throw err
  app.log.info(`server listening on ${address}`)
})
