import { Model } from 'objection'
import { join } from 'path'

import Company from './Company'
import Category from './Category'
import Tag from './Tag'

import { SCHEMA_JOIN as SCHEMA } from '../constants'

export default class Job extends Model {
  readonly id!: number
  title: string
  slug: string
  level?: string
  type: string
  salaryFrom?: number
  salaryTo?: number
  salariesHistory: { date: Date; range: [number, number] }[]
  publishedAt: Date
  description: string
  meta?: {}
  version: number

  company: Company
  categories: Category[]
  tags?: Tag[]

  static tableName = SCHEMA.jobs.__tableName

  static relationMappings = () => ({
    company: {
      relation: Model.BelongsToOneRelation,
      modelClass: join(__dirname, 'Company'),
      join: {
        from: SCHEMA.jobs.companyId,
        to: SCHEMA.companies.id
      }
    },

    tags: {
      relation: Model.ManyToManyRelation,
      modelClass: join(__dirname, 'Tag'),
      join: {
        from: SCHEMA.jobs.id,
        through: {
          from: SCHEMA.jobsCategories.jobId,
          to: SCHEMA.jobsCategories.categoryId
        },
        to: SCHEMA.categories.id
      }
    },

    categories: {
      relation: Model.ManyToManyRelation,
      modelClass: join(__dirname, 'Category'),
      join: {
        from: SCHEMA.jobs.id,
        through: {
          from: SCHEMA.jobsCategories.jobId,
          to: SCHEMA.jobsCategories.categoryId
        },
        to: SCHEMA.categories.id
      }
    }
  })
}
