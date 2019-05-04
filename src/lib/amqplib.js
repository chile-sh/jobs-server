import amqplib from 'amqplib'

import config from '../config.js'
import logger, { logError } from './logger.js'
import isFunction from 'lodash/isFunction.js'

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
      msg =>
        onMsg(msg, ch).catch(
          err => onError && onError(ch, msg, err, queueName)
        ),
      { noAck: false }
    )

    logger.info(`[${queueName}] Waiting for messages.`)

    return ch
  } catch (err) {
    logError(err)
  }
}

export const sendToQueue = ch => async (queue, data) =>
  ch.sendToQueue(queue, Buffer.from(JSON.stringify(data)))

export const getQueuesInfo = async (ch, allQueues) => {
  const queues = await Promise.all(
    allQueues.map(queue => ch.checkQueue(queue.name))
  )

  return {
    done: queues.every(queue => queue.messageCount === 0),
    queues
  }
}

export const waitForQueuesToEnd = (
  ch,
  allQueues,
  { interval = 1000, waitOnEnd = 5000, onStatus, onEnd } = {}
) =>
  new Promise(resolve => {
    const check = async done => {
      const status = await getQueuesInfo(ch, allQueues)

      isFunction(onStatus) && onStatus(status)

      if (done) {
        isFunction(onEnd) && onEnd(status)
        return resolve(status)
      }

      if (!status.done) return setTimeout(check, interval)

      setTimeout(() => check(true), waitOnEnd)
    }

    check()
  })

export default amqplib
