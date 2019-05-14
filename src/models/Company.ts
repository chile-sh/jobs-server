import { Model } from 'objection'
import { join } from 'path'

import Job from './Job'

import { SCHEMA_JOIN as SCHEMA } from '../constants'

export default class Company extends Model {
  readonly id!: number
  name: string
  slug: string
  shortDescription?: string
  description?: string
  logo?: string
  meta?: {}

  jobs?: Job[]

  static tableName = SCHEMA.companies.__tableName

  static relationMappings = () => ({
    jobs: {
      relation: Model.HasManyRelation,
      modelClass: join(__dirname, 'Job'),
      join: {
        from: SCHEMA.companies.id,
        to: SCHEMA.jobs.companyId
      }
    }
  })
}
