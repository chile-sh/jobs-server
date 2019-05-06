import amqplib from 'amqplib'

import isFunction from 'lodash/isFunction'
import config from '../config'
import { logError, logger } from './logger'

const { user, pass, host } = config.rabbitmq
const url = user && pass ? `amqp://${user}:${pass}@${host}` : `amqp://${host}`

export const open = amqplib.connect(url)

export const createQueue = async (queueName, opts, onMsg, onError) => {
  const { prefetch = 1, assert = [] } = opts

  try {
    const conn = await open
    const ch = await conn.createChannel()
    await ch.prefetch(prefetch)

    await Promise.all([...assert, queueName].map(q => ch.assertQueue(q)))

    ch.consume(
      queueName,
      (msg: any) =>
        onMsg(msg, ch).catch(
          (err: Error) => onError && onError(ch, msg, err, queueName)
        ),
      { noAck: false }
    )

    logger.info(`[${queueName}] Waiting for messages.`)

    return ch
  } catch (err) {
    logError(err)
  }
}

export const sendToQueue = ch => async (queue: string, data: any) =>
  ch.sendToQueue(queue, Buffer.from(JSON.stringify(data)))

export const getQueuesInfo = async (ch, allQueues) => {
  const queues = await Promise.all(
    allQueues.map(queue => ch.checkQueue(queue.name))
  )

  return {
    done: queues.every((queue: any) => queue.messageCount === 0),
    queues
  }
}

interface OptionalParams {
  interval?: number
  waitOnEnd?: number
  onStatus?: Function
  onEnd?: Function
}

export const waitForQueuesToEnd = (
  ch,
  allQueues,
  { interval = 1000, waitOnEnd = 5000, onStatus, onEnd }: OptionalParams = {}
) =>
  new Promise(resolve => {
    const check = async (done?: boolean) => {
      const status = await getQueuesInfo(ch, allQueues)

      isFunction(onStatus) && onStatus(status)

      if (done) {
        isFunction(onEnd) && onEnd(status)
        return resolve(status)
      }

      if (!status.done) {
        return setTimeout(check, interval)
      }

      setTimeout(() => check(true), waitOnEnd)
    }

    check()
  })

export default amqplib
