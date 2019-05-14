import { Model } from 'objection'
import { join } from 'path'

import City from './City'

import { SCHEMA_JOIN as SCHEMA } from '../constants'
console.log(SCHEMA)
export default class Country extends Model {
  readonly id!: number
  name: string
  cities: City[]

  static tableName = SCHEMA.countries.__tableName

  static relationMappings = () => ({
    country: {
      relation: Model.HasManyRelation,
      modelClass: join(__dirname, 'City'),
      join: {
        from: SCHEMA.countries.id,
        to: SCHEMA.cities.countryId
      }
    }
  })
}
