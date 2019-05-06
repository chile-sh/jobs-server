import * as Knex from 'knex'

import { TABLES } from '../constants'

const relate = (table: Knex.TableBuilder) => (name: string, inTable: string) =>
  table
    .integer(name)
    .notNullable()
    .references('id')
    .inTable(inTable)

export async function up(knex: Knex): Promise<any> {
  await knex.schema.createTable(TABLES.SNAPSHOTS, table => {
    table.integer('id').primary()
    table.timestamp('process_started_at')
    table.timestamp('process_finished_at')
    table.json('info')
    table.json('errors')
    table.integer('version')
    table.timestamps(true, true)
  })

  await knex.schema.createTable(TABLES.COMPANIES, table => {
    table.integer('id').primary()
    table.string('name')
    table.string('slug')
    table.text('short_description')
    table.text('description')
    table.string('logo')
    table.string('url')
    table.json('meta')
    table.timestamps(true, true)
  })

  await knex.schema.createTable(TABLES.JOBS, table => {
    table.bigInteger('id').primary()
    relate(table)('company_id', TABLES.COMPANIES)

    table.string('title')
    table.string('slug')
    table.string('level')
    table.string('type')
    table.bigInteger('salaryFrom')
    table.bigInteger('salaryTo')
    table.json('salaries_history')
    table.date('published_at')
    table.text('description')
    table.json('meta')
    table.integer('version')
    table.timestamps(true, true)
  })

  await knex.schema.createTable(TABLES.CATEGORIES, table => {
    table.integer('id').primary()
    table.string('name')
    table.string('slug')
    table.timestamps(true, true)
  })

  await knex.schema.createTable(TABLES.TAGS, table => {
    table.integer('id').primary()
    table.string('name')
  })

  await knex.schema.createTable(TABLES.JOBS_TAGS, table => {
    table.bigInteger('id').primary()
    relate(table)('job_id', TABLES.JOBS)
    relate(table)('tag_id', TABLES.TAGS)
  })

  await knex.schema.createTable(TABLES.JOBS_CATEGORIES, table => {
    table.bigInteger('id').primary()
    relate(table)('job_id', TABLES.JOBS)
    relate(table)('category_id', TABLES.CATEGORIES)
  })

  await knex.schema.createTable(TABLES.JOBS_COMPANIES, table => {
    table.bigInteger('id').primary()
    relate(table)('job_id', TABLES.JOBS)
    relate(table)('company_id', TABLES.COMPANIES)
  })
}

export async function down(knex: Knex): Promise<any> {
  await knex.schema.dropTable(TABLES.JOBS_COMPANIES)
  await knex.schema.dropTable(TABLES.JOBS_CATEGORIES)
  await knex.schema.dropTable(TABLES.JOBS_TAGS)
  await knex.schema.dropTable(TABLES.JOBS)
  await knex.schema.dropTable(TABLES.TAGS)
  await knex.schema.dropTable(TABLES.CATEGORIES)
  await knex.schema.dropTable(TABLES.COMPANIES)
  await knex.schema.dropTable(TABLES.SNAPSHOTS)
}
