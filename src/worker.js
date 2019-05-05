import cron from 'cron'
import { Worker, isMainThread, parentPort, SHARE_ENV } from 'worker_threads'

import { run as runGetOnBrdQueue } from './scrapers/getonbrd'
import { logger } from './lib/logger'

const { CronJob } = cron

if (isMainThread) {
  // eslint-disable-next-line
  new CronJob(
    '0 18,23 * * *',
    () => {
      const worker = new Worker(__filename, { env: SHARE_ENV })

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
