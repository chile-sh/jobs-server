import fastify from 'fastify'
import { logger } from './lib/logger'
import config from './config'
import path from 'path'

// import { ApolloServer } from 'apollo-server-fastify'

import './lib/sentry'
import { initWorker } from './worker'

const workerFile = config.isProd ? 'worker.js' : 'worker.import.js'
initWorker(path.resolve(__dirname, workerFile))

/*
const server = new ApolloServer({
  typeDefs: [],
  resolvers: []
})

app.register(server.createHandler())
*/

const app = fastify({ logger })

app.listen(config.port)
