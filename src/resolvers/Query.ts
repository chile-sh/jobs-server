import { QueryBuilder } from 'knex'

import Job from '@common/models/Job'
import Category from '@common/models/Category'
import City from '@common/models/City'

const getFields = node =>
  node.selectionSet.selections.map(sel => sel.name.value)

const createJobQuery = (args, info) => (gqlNode = 'jobs') => {
  const { limit, offset, salaryFrom, salaryTo, title } = args
  let joins = []

  const fields = getFields(info.fieldNodes.find(n => n.name.value === gqlNode))
  const relations = ['category', 'tag', 'source']
  joins = fields.filter(f => relations.indexOf(f) > -1)

  if (fields.includes('country') || fields.includes('city')) {
    joins.push('city.[country]')
  }

  if (fields.includes('company')) {
    joins.push('company.[logoAsset]')
  }

  const joinStr = joins.length ? `[${joins.join(',')}]` : undefined

  let qry = Job.query()
    .skipUndefined()
    .joinEager(joinStr)
    .limit(limit)
    .offset(offset)
    .where('jobs.version', '>=', (builder: QueryBuilder) => {
      builder
        .max('version')
        .from('snapshots')
        .where('current', true)
    })

  if (typeof salaryFrom !== 'undefined') {
    qry = qry.andWhere('salary_from', '>=', salaryFrom)
  }

  if (typeof salaryTo !== 'undefined') {
    qry = qry.andWhere('salary_to', '<=', salaryTo)
  }

  if (title) qry = qry.andWhere('jobs.title', 'ilike', `%${title}%`)

  return qry.runAfter(res =>
    res.map(job => {
      if (job.city) {
        job.country = job.city ? job.city.country : null
        delete job.city.country
      }

      return job
    })
  )
}

export default {
  jobs: async (_, args, ctx, info) => createJobQuery(args, info)('jobs'),

  getJob: async (_, args, ctx, info) => {
    const { id, slug } = args
    const qry = createJobQuery(args, info)('getJob')
    if (id) return qry.where('jobs.id', id).first()
    if (slug) return qry.where('jobs.slug', slug).first()
  },

  categories: () => Category.query(),

  cities: () => City.query()
}
