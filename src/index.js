import cron from 'cron'
import { fileURLToPath } from 'url'
import { Worker, isMainThread, parentPort } from 'worker_threads'

import './lib/sentry.js'
import logger from './lib/logger.js'

import { run as runGetOnBrdQueue } from './components/getonbrd/index.js'

const { CronJob } = cron

if (isMainThread) {
  // eslint-disable-next-line
  new CronJob(
    '0 18,23 * * *',
    () => {
      const worker = new Worker(fileURLToPath(import.meta.url))
      worker.on('message', msg => logger.info(msg))
      worker.on('error', err => logger.error(err.message))
      worker.on('exit', code => {
        if (code !== 0) logger.error(`Worker stopped with exit code ${code}`)
      })
    },
    null,
    true,
    'America/Santiago',
    null,
    true
  )
} else {
  runGetOnBrdQueue(msg => parentPort.postMessage(msg), () => process.exit())
}
