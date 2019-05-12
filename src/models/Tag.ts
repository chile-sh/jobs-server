import { Model } from 'objection'
import { join } from 'path'

import Job from './Job'

import { SCHEMA_JOIN as SCHEMA } from '../constants'

export default class Tag extends Model {
  readonly id!: number
  name: string
  jobs: Job[]

  static tableName = SCHEMA.tags.__tableName

  static relationMappings = () => ({
    jobs: {
      relation: Model.ManyToManyRelation,
      modelClass: join(__dirname, 'Job'),
      join: {
        from: SCHEMA.tags.id,
        through: {
          from: SCHEMA.jobsTags.jobId,
          to: SCHEMA.jobsTags.tagId
        },
        to: SCHEMA.jobs.id
      }
    }
  })
}
