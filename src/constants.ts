const makeDbSchema = (joinColumns?: boolean) => {
  const id = 'id'

  const tables = {
    jobs: {
      __tableName: 'jobs',
      __timestamps: true,
      id,
      companyId: 'company_id',
      title: 'title',
      slug: 'slug',
      level: 'level',
      type: 'type',
      salaryFrom: 'salary_from',
      salaryTo: 'salary_to',
      salariesHistory: 'salaries_history',
      publishedAt: 'published_at',
      description: 'description',
      meta: 'meta',
      version: 'version'
    },
    companies: {
      __tableName: 'companies',
      __timestamps: true,
      id,
      name: 'name',
      slug: 'slug',
      shortDescription: 'short_description',
      description: 'description',
      logo: 'logo',
      meta: 'meta'
    },
    categories: {
      __tableName: 'categories',
      __timestamps: true,
      id,
      name: 'name',
      slug: 'slug'
    },
    snapshots: {
      __tableName: 'snapshots',
      id,
      processStartedAt: 'process_started_at',
      processFinishedAt: 'process_finished_at',
      info: 'info',
      errors: 'errors',
      version: 'version'
    },
    tags: {
      __tableName: 'tags',
      id,
      name: 'name'
    },
    jobsCategories: {
      __tableName: 'jobs_categories',
      id,
      jobId: 'job_id',
      categoryId: 'category_id'
    },
    jobsTags: {
      __tableName: 'jobs_tags',
      id,
      jobId: 'job_id',
      tagId: 'tag_id'
    }
  }

  for (const tableKey in tables) {
    const table = tables[tableKey]
    if (table.__timestamps) {
      table.createdAt = 'created_at'
      table.updatedAt = 'updated_at'
    }

    if (joinColumns) {
      for (const columnKey in table) {
        if (columnKey === 'tableName') continue
        const column = table[columnKey]
        tables[tableKey][columnKey] = [table.__tableName, column].join('.')
      }
    }
  }

  return tables
}

export const SCHEMA = makeDbSchema()
export const SCHEMA_JOIN = makeDbSchema(true)
