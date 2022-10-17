import {
  ApolloServerPluginDrainHttpServer,
  formatApolloErrors,
} from "apollo-server-core";
import { ApolloServer } from "apollo-server-fastify";
import fastify from "fastify";
import { buildSchema } from "type-graphql";
import UserResolver from "../modules/user/user.resolver";
import { ApolloServerPluginLandingPageGraphQLPlayground } from "@apollo/server-plugin-landing-page-graphql-playground";

const app = fastify();

function buildContext() {}

export async function createServer() {
  const schema = await buildSchema({
    resolvers: [UserResolver],
  });

  const server = new ApolloServer({
    schema,
    allowBatchedHttpRequests: true,
    plugins: [
      ApolloServerPluginDrainHttpServer({
        httpServer: app.server,
      }),
      ApolloServerPluginLandingPageGraphQLPlayground(),
    ],
    context: buildContext(),
  });

  return {
    app,
    server,
  };
}
