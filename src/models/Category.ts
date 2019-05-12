import { Model } from 'objection'
import { join } from 'path'

import Job from './Job'

import { SCHEMA_JOIN as SCHEMA } from '../constants'

export default class Category extends Model {
  readonly id!: number
  name: string
  slug: string

  jobs?: Job[]

  static tableName = SCHEMA.categories.__tableName

  static relationMappings = () => ({
    jobs: {
      relation: Model.ManyToManyRelation,
      modelClass: join(__dirname, 'Job'),
      join: {
        from: SCHEMA.categories.id,
        through: {
          from: SCHEMA.jobsCategories.categoryId,
          to: SCHEMA.jobsCategories.jobId
        },
        to: SCHEMA.jobs.id
      }
    }
  })
}
