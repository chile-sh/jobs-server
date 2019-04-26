import Sentry from '@sentry/node'
import config from '../config.js'

Sentry.init({ dsn: config.sentry.dsn })

export default Sentry
