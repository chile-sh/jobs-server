import { Model } from 'objection'
import { join } from 'path'

import Country from './Country'

import { SCHEMA_JOIN as SCHEMA } from '../constants'

export default class City extends Model {
  readonly id!: number
  name: string
  country: Country

  static tableName = SCHEMA.cities.__tableName

  static relationMappings = () => ({
    country: {
      relation: Model.BelongsToOneRelation,
      modelClass: join(__dirname, 'Country'),
      join: {
        from: SCHEMA.cities.countryId,
        to: SCHEMA.countries.id
      }
    }
  })
}
