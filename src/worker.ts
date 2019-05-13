import { parentPort } from 'worker_threads'
import { run as runGetOnBrdQueue } from '@components/getonbrd'

runGetOnBrdQueue(
  (msg: any) => parentPort.postMessage(msg),
  () => process.exit()
)
