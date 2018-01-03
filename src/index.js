import fs from 'fs'
import path from 'path'
import express from 'express'
import graphqlHTTP from 'express-graphql'
import { makeExecutableSchema } from 'graphql-tools'
import mongoose from 'mongoose'
import cors from 'cors'

import logger from 'happy-log'

import resolvers from './resolvers'

const MONGO_URL = process.env.MONGO_URL
const DEFAULT_ROUTE = 'data'
const PORT = process.env.PORT || 4000

const CORS_WHITELIST = [
  'http://localhost:3000',
  'http://localhost:8080'
]

const CORS_OPTIONS = {
  origin: (origin, cb) => {
    if (CORS_WHITELIST.indexOf(origin) !== -1) {
      cb(null, true)
    } else {
      cb(new Error(`CORS prevented request from origin: ${origin}`))
    }
  }
}

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

  app.use(`/${DEFAULT_ROUTE}`, cors(CORS_OPTIONS), graphqlHTTP({
    schema,
    graphiql: !isProduction
  }))

  app.listen(PORT)

  logger.info(`Running a GraphQL API server at localhost:${PORT}/${DEFAULT_ROUTE}`)
}

start()
