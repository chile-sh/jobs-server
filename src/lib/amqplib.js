import amqplib from 'amqplib'

import config from '../config.js'
import logger, { logError } from './logger.js'

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

export default amqplib
