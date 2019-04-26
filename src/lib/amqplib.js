import amqplib from 'amqplib'
import config from '../config.js'

export const open = amqplib.connect(config.rabbitmq.host)

export default amqplib
