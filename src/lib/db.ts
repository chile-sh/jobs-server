import Knex from 'knex'
import { knexSnakeCaseMappers, Model } from 'objection'

import config from '../config'
import * as knexConfig from '../knexfile'

const knex = Knex({
  ...knexConfig[config.env],
  ...knexSnakeCaseMappers()
})

Model.knex(knex)

export const upsert = (table: string, object: any, constraint: string) => {
  const insert = knex(table).insert(object)
  const update = knex.queryBuilder().update(object)
  return knex
    .raw(`? ON CONFLICT ${constraint} DO ? returning *`, [insert, update])
    .get('rows')
    .get(0)
}

export default knex
