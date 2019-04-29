import Knex from 'knex'
import config from '../knexfile.js'

export const db = Knex(config.development)
