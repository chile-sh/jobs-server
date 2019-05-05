import * as Sentry from '@sentry/node'
import config from '../config.js'

if (config.isProd) {
  Sentry.init({ dsn: config.sentry.dsn })
}

export default Sentry
