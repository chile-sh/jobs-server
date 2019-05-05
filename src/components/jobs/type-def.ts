import { gql } from 'apollo-server'

export const typeDef = gql`
  type Job {
    title: String
  }

  extend type Query {
    jobs: [Job]
  }
`
