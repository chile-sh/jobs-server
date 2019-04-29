import crypto from 'crypto'

export const md5 = str =>
  crypto
    .createHash('md5')
    .update(str)
    .digest('hex')

export const joinDots = (...args) => args.filter(Boolean).join('.')
