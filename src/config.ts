import commonConfig from '@common/config'

const { PORT = 4000 } = process.env

export default {
  ...commonConfig,
  port: Number(PORT)
}
