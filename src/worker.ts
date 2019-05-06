import { CronJob } from 'cron'
import { Worker, isMainThread, parentPort } from 'worker_threads'

import { run as runGetOnBrdQueue } from './components/getonbrd'
import { logger } from './lib/logger'

export const initWorker = (workerFile: string) => {
  if (isMainThread) {
    new CronJob(
      '0 18,23 * * *',
      () => {
        const worker = new Worker(workerFile)

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
  }
}

if (!isMainThread) {
  runGetOnBrdQueue(
    (msg: any) => parentPort.postMessage(msg),
    () => process.exit()
  )
}
