import * as Knex from 'knex'

import { SCHEMA } from '../constants'

const {
  cities,
  countries,
  snapshots,
  companies,
  jobs,
  categories,
  tags,
  jobsTags
} = SCHEMA

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

const dropCascade = (knex, table) => knex.raw(`DROP TABLE ${table} CASCADE`)

export async function up(knex: Knex): Promise<any> {
  await knex.schema.createTable(countries.__tableName, table => {
    table.increments(countries.id)
    table.string(countries.name)
  })

  await knex.schema.createTable(cities.__tableName, table => {
    table.increments(cities.id)
    table.string(cities.name)
    relate(table)(cities.countryId, countries.id, countries.__tableName)
  })

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

  await knex.schema.createTable(categories.__tableName, table => {
    table.increments(categories.id)
    table.string(categories.name)
    table.string(categories.slug)
    table.timestamps(true, true)
  })

  await knex.schema.createTable(jobs.__tableName, table => {
    table.increments(jobs.id)
    relate(table)(jobs.companyId, companies.id, companies.__tableName)
    relate(table)(jobs.cityId, cities.id, cities.__tableName)
    relate(table)(jobs.categoryId, categories.id, categories.__tableName)

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

  await knex.schema.createTable(tags.__tableName, table => {
    table.increments(tags.id)
    table.string(tags.name).index()
  })

  await knex.schema.createTable(jobsTags.__tableName, table => {
    table.increments(jobsTags.id)
    relate(table)(jobsTags.jobId, jobs.id, jobs.__tableName)
    relate(table)(jobsTags.tagId, tags.id, tags.__tableName)
  })
}

export async function down(knex: Knex): Promise<any> {
  await dropCascade(knex, jobsTags.__tableName)
  await dropCascade(knex, tags.__tableName)
  await dropCascade(knex, snapshots.__tableName)
  await dropCascade(knex, jobs.__tableName)
  await dropCascade(knex, companies.__tableName)
  await dropCascade(knex, categories.__tableName)
  await dropCascade(knex, countries.__tableName)
  await dropCascade(knex, cities.__tableName)
}
