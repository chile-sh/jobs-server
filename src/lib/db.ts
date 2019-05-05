import Knex from 'knex'
import config from '../config'
import knexConfig from '../knexfile'

export default Knex(knexConfig[config.env])
