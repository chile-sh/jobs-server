import commonConfig from '@common/config'

const { PORT = 3000 } = process.env

export default {
  ...commonConfig,
  appName: 'jobs',
  port: Number(PORT)
}
