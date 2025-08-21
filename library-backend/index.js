import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@as-integrations/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { WebSocketServer } from 'ws';
import { useServer } from 'graphql-ws/lib/use/ws';
import express from 'express';
import cors from 'cors';
import http from 'http';

import jwt from 'jsonwebtoken';
import config from './utils/config.js';
import typeDefs from './schema/typeDefs.js';
import resolvers from './schema/resolvers.js';

import mongoose from 'mongoose';
mongoose.set('strictQuery', false);

import Author from './models/author.js';
import Book from './models/book.js';
import User from './models/user.js';

// 8.13 Tietokanta
const MONGODB_URI = config.MONGODB_URI
console.log('connecting to', MONGODB_URI)

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connection to MongoDB:', error.message)
  })

const start = async () => {
  const app = express()
  const httpServer = http.createServer(app)

  const wsServer = new WebSocketServer({
    server: httpServer,
    path: '/graphql',
  })

  const schema = makeExecutableSchema({ typeDefs, resolvers })
  const serverCleanup = useServer({ schema }, wsServer)

  const server = new ApolloServer({
    schema,
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),
      {
        async serverWillStart() {
          console.log("Server is starting...")
          return {
            async drainServer() {
              console.log("Draining server...");
              await serverCleanup.dispose();
              console.log("Server drained.");
            },
          };
        },
      },
    ],
  })

  // Apollo-palvelimen käynnistys
  await server.start()
  app.use(
    '/graphql',
    cors(),
    express.json(),
    expressMiddleware(server, {
      context: async ({ req }) => {
        let currentUser = null
        const auth = req?.headers.authorization
        if (auth && auth.startsWith('Bearer ')) {
          try {
            const decodedToken = jwt.verify(auth.substring(7), process.env.JWT_SECRET)
            currentUser = await User.findById(decodedToken.id)
          } catch (err) {
            console.error("JWT error:", err.message)
          }
        }
        return {
          currentUser,
          models: { Book, Author, User },
        }
      },
    }),
  )

  
  const PORT = 4001
  httpServer.listen(PORT, () =>
    console.log(`Server is now running on http://localhost:${PORT}`)
  )

}
start()