import "reflect-metadata"
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import express from "express";
import http from "http";
import cors from "cors";
import { AppDataSource } from "./data-source.js"; 
import { buildSchema } from "type-graphql";
import UserResolver from "./Resolvers/UserResolver.js";
import RunRecordResolver from "./Resolvers/RunRecordResolver.js";

interface MyContext {
  token?: string;
};

AppDataSource.initialize().then(async () => {
}).catch(error => console.log(error))

const app = express();
const httpServer = http.createServer(app);

const schema = await buildSchema({
  resolvers: [ 
    UserResolver,
    RunRecordResolver
  ]
})

const server = new ApolloServer<MyContext>({schema});
await server.start();

app.use(
  '/',
  cors<cors.CorsRequest>(),
  express.json(),
  expressMiddleware(server, {
    context: async ({ req }) => ({ token: req.headers.token }),
  }),
);

await new Promise<void>((resolve) =>
  httpServer.listen({ port: 4999 }, resolve),
);
console.log(`🚀 Server ready at http://localhost:4999/`);