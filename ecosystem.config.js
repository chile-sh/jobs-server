'use strict'

const path = require('path')

const isProd = process.env.NODE_ENV === 'production'
const watch = isProd ? false : path.resolve(__dirname, 'src')

module.exports = {
  apps: [
    {
      name: 'jobs-server',
      script: 'src/index.js',
      instances: 1,
      autorestart: true,
      watch,
      max_memory_restart: '1G'
    },
    {
      name: 'jobs-bot',
      script: 'src/bot.js',
      instances: 1,
      autorestart: true,
      watch,
      max_memory_restart: '1G'
    }
  ]
}
