import * as Knex from 'knex'

import { SCHEMA } from '../constants'

const relate = (table: Knex.TableBuilder) => (
  name: string,
  ref: string,
  inTable: string
) =>
  table
    .integer(name)
    .notNullable()
    .references(ref)
    .inTable(inTable)

const {
  snapshots,
  companies,
  jobs,
  categories,
  tags,
  jobsTags,
  jobsCategories
} = SCHEMA

export async function up(knex: Knex): Promise<any> {
  await knex.schema.createTable(snapshots.__tableName, table => {
    table.increments(snapshots.id)
    table.timestamp(snapshots.processStartedAt)
    table.timestamp(snapshots.processFinishedAt)
    table.json(snapshots.info)
    table.json(snapshots.errors)
    table.integer(snapshots.version)
    table.timestamps(true, true)
  })

  await knex.schema.createTable(companies.__tableName, table => {
    table.increments(companies.id)
    table.string(companies.name).index()
    table.string(companies.slug).unique()
    table.text(companies.shortDescription)
    table.text(companies.description)
    table.string(companies.logo)
    table.json(companies.meta)
    table.timestamps(true, true)
  })

  await knex.schema.createTable(jobs.__tableName, table => {
    table.increments(jobs.id)
    relate(table)(jobs.companyId, SCHEMA.companies.id, companies.__tableName)

    table.string(jobs.title).index()
    table.string(jobs.slug).unique()
    table.string(jobs.level).index()
    table.string(jobs.type).index()
    table.bigInteger(jobs.salaryFrom)
    table.bigInteger(jobs.salaryTo)
    table.json(jobs.salariesHistory)
    table.date(jobs.publishedAt)
    table.text(jobs.description).index()
    table.json(jobs.meta)
    table.integer(jobs.version)
    table.timestamps(true, true)
  })

  await knex.schema.createTable(categories.__tableName, table => {
    table.increments(categories.id)
    table.string(categories.name)
    table.string(categories.slug)
    table.timestamps(true, true)
  })

  await knex.schema.createTable(tags.__tableName, table => {
    table.increments(tags.id)
    table.string(tags.name).index()
  })

  await knex.schema.createTable(jobsTags.__tableName, table => {
    table.increments(jobsTags.id)
    relate(table)(jobsTags.jobId, SCHEMA.jobs.id, jobs.__tableName)
    relate(table)(jobsTags.tagId, SCHEMA.tags.id, tags.__tableName)
  })

  await knex.schema.createTable(jobsCategories.__tableName, table => {
    table.increments(jobsCategories.id)
    relate(table)(jobsCategories.jobId, SCHEMA.jobs.id, jobs.__tableName)
    relate(table)(
      jobsCategories.categoryId,
      SCHEMA.categories.id,
      categories.__tableName
    )
  })
}

export async function down(knex: Knex): Promise<any> {
  await knex.schema.dropTable(jobsCategories.__tableName)
  await knex.schema.dropTable(jobsTags.__tableName)
  await knex.schema.dropTable(tags.__tableName)
  await knex.schema.dropTable(snapshots.__tableName)
  await knex.schema.dropTable(categories.__tableName)
  await knex.raw(`DROP TABLE ${jobs.__tableName} CASCADE`)
  await knex.raw(`DROP TABLE ${companies.__tableName} CASCADE`)
}
