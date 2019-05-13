import * as crypto from 'crypto'
import ms from 'ms'

export const md5 = (str: string) =>
  crypto
    .createHash('md5')
    .update(str)
    .digest('hex')

export const joinDots = (...args: (string | number)[]) =>
  args.filter(Boolean).join('.')

export const toSeconds = (time: string | number) =>
  typeof time === 'number' ? time : ms(time) / 1000
