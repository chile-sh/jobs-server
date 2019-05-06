import Knex from 'knex'
import config from '../config'
import * as knexConfig from '../knexfile'

export default Knex(knexConfig[config.env])
