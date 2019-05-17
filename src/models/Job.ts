import { Model } from 'objection'
import { join } from 'path'

import Company from './Company'
import Category from './Category'
import Tag from './Tag'
import City from './City'

import { SCHEMA_JOIN as SCHEMA } from '../constants'

export default class Job extends Model {
  readonly id!: number
  title: string
  slug: string
  level?: string
  type: string
  salaryFrom?: number
  salaryTo?: number
  salariesHistory?: { date: Date; range: [number, number] }[] | string
  publishedAt: Date
  description: string
  meta?: {} | string
  version: number

  company: Company
  category: Category
  tags?: Tag[]
  city: City

  static tableName = SCHEMA.jobs.__tableName

  static relationMappings = () => ({
    city: {
      relation: Model.BelongsToOneRelation,
      modelClass: join(__dirname, 'City'),
      join: {
        from: SCHEMA.jobs.cityId,
        to: SCHEMA.cities.id
      }
    },

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
          from: SCHEMA.jobsTags.jobId,
          to: SCHEMA.jobsTags.tagId
        },
        to: SCHEMA.tags.id
      }
    },

    category: {
      relation: Model.BelongsToOneRelation,
      modelClass: join(__dirname, 'Category'),
      join: {
        from: SCHEMA.jobs.categoryId,
        to: SCHEMA.categories.id
      }
    }
  })
}
