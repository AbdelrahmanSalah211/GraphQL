import config from 'dotenv';
config.config();

import { ApolloServer } from '@apollo/server';
import express, { json as _json } from 'express';
import cors from 'cors';
import connectDB from './config/database.js';
import { expressMiddleware } from '@as-integrations/express5';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import typeDefs from './graphql/schema.js';
import resolvers from './graphql/resolver.js';
import { createServer } from 'http';

connectDB();

const app = express();
const httpServer = createServer(app);


const server = new ApolloServer({
  typeDefs,
  resolvers,
  plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
});
await server.start();

app.use(
  cors(),
  _json(),
  expressMiddleware(server),
);

const port = process.env.PORT;

await new Promise((resolve) => httpServer.listen({ port }, resolve));
console.log(`Server ready at http://localhost:${port}`);
