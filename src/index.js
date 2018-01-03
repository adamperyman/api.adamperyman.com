import fs from 'fs'
import path from 'path'
import express from 'express'
import graphqlHTTP from 'express-graphql'
import { makeExecutableSchema } from 'graphql-tools'
import mongoose from 'mongoose'

import logger from 'happy-log'

import resolvers from './resolvers'

const MONGO_URL = process.env.MONGO_URL

if (!MONGO_URL) {
  logger.error('MONGO_URL is undefined.')
  process.exit(1)
}

const isProduction = process.env.NODE_ENV === 'production'

const schemaFile = path.join(__dirname, 'schema.graphql')
const typeDefs = fs.readFileSync(schemaFile, 'utf8')

const schema = makeExecutableSchema({ typeDefs, resolvers })

const start = async () => {
  await mongoose.connect(MONGO_URL)

  const app = express()

  app.use(logger.expressMiddleware)

  app.use('/graphql', graphqlHTTP({
    schema,
    graphiql: !isProduction
  }))

  app.listen(4000)

  logger.info('Running a GraphQL API server at localhost:4000/graphql')
}

start()
