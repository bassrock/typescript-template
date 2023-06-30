import { ApolloServer, GraphQLRequestContext } from '@apollo/server';
import { buildSubgraphSchema } from '@apollo/subgraph';
import { typeDefs } from './typeDefs';
import { resolvers } from './resolvers';
import { errorHandler } from '@pocket-tools/apollo-utils';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import {
  ApolloServerPluginLandingPageDisabled,
  ApolloServerPluginInlineTraceDisabled,
  ApolloServerPluginUsageReportingDisabled,
} from '@apollo/server/plugin/disabled';
import { ApolloServerPluginInlineTrace } from '@apollo/server/plugin/inlineTrace';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import http, { Server } from 'http';
import express from 'express';
import cors from 'cors';
import { expressMiddleware } from '@apollo/server/express4';

export async function startServer(port: number): Promise<{
  app: Express.Application;
  server: ApolloServer;
  url: string;
}> {
  // initialize express with exposed httpServer so that it may be
  // provided to drain plugin for graceful shutdown.
  const app = express();
  const httpServer = http.createServer(app);

  // JSON parser to enable POST body with JSON
  app.use(express.json());

  // expose a health check url
  app.get('/.well-known/apollo/server-health', (req, res) => {
    res.status(200).send('ok');
  });

  // set up server
  const server = await getServer(httpServer);
  await server.start();
  const url = '/';

  app.use(url, cors<cors.CorsRequest>(), expressMiddleware(server));

  await new Promise<void>((resolve) => httpServer.listen({ port }, resolve));
  return { app, server, url };
}

const getServer = (httpServer: Server): ApolloServer => {
  const defaultPlugins = [ApolloServerPluginDrainHttpServer({ httpServer })];
  const prodPlugins = [
    ApolloServerPluginLandingPageDisabled(),
    ApolloServerPluginInlineTrace(),
  ];
  const nonProdPlugins = [
    ApolloServerPluginLandingPageLocalDefault(),
    ApolloServerPluginInlineTraceDisabled(),
    // Usage reporting is enabled by default if you have APOLLO_KEY in your environment
    ApolloServerPluginUsageReportingDisabled(),
  ];

  const plugins =
    process.env.NODE_ENV === 'production'
      ? defaultPlugins.concat(prodPlugins)
      : defaultPlugins.concat(nonProdPlugins);
  return new ApolloServer({
    schema: buildSubgraphSchema({ typeDefs: typeDefs, resolvers }),
    plugins,
    formatError: errorHandler,
  });
};
