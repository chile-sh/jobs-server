import { logError } from '../../lib/logger.js'

export const onError = (ch: any, msg: any, err: any, key: string) => {
  if (err.response && err.response.statusCode) {
    switch (err.response.statusCode) {
      case 404:
      case 500:
        return ch.reject(msg, false)
    }

    return ch.nack(msg)
  }

  if (msg) ch.reject(msg, false)

  logError(err, key)
}