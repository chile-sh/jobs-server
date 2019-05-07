import * as crypto from 'crypto'

export const md5 = (str: string) =>
  crypto
    .createHash('md5')
    .update(str)
    .digest('hex')

export const joinDots = (...args: (string | number)[]) =>
  args.filter(Boolean).join('.')
