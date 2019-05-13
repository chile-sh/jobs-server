import fastify from 'fastify'
import { CronJob } from 'cron'
import { Worker } from 'worker_threads'
import { logger } from '@lib/logger'
import path from 'path'
// import { ApolloServer } from 'apollo-server-fastify'

import config from '@/config'
import '@lib/sentry'

const initCronJob = (bot: any) => {
  const tz = 'America/Santiago'
  const cronCb = () => {
    const worker = new Worker(path.join(__dirname, 'worker.js'), {
      workerData: {
        path: './worker.ts'
      }
    })

    worker.on('message', msg => logger.info(msg))
    worker.on('error', err => logger.error(`${err.name}: ${err.message}`))
    worker.on('exit', code => {
      if (code !== 0) {
        logger.error(`Worker stopped with exit code ${JSON.stringify(code)}`)
      }
    })
  }

  return new CronJob(bot.cron, cronCb, null, true, tz, null, bot.runOnInit)
}

initCronJob(config.bots.getonbrd)

/*
const server = new ApolloServer({
  typeDefs: [],
  resolvers: []
})

app.register(server.createHandler())
*/

const app = fastify({ logger })

app.listen(config.port)
