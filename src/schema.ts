import path from 'path'
import { GraphQLSchema } from 'graphql'
import { importSchema } from 'graphql-import'
import { makeExecutableSchema } from 'graphql-tools'

import { GraphQLDateTime } from 'graphql-iso-date'
import GraphQLJSON, { GraphQLJSONObject } from 'graphql-type-json'

import resolvers from './resolvers'

const typeDefs = importSchema(path.join(__dirname, './schema/schema.graphql'))

const schema: GraphQLSchema = makeExecutableSchema({
  typeDefs,
  resolvers: {
    ...resolvers,
    DateTime: GraphQLDateTime,
    JSON: GraphQLJSON,
    JSONObject: GraphQLJSONObject
  }
})

export default schema
