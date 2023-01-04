import Cors from 'micro-cors';
import { ApolloServer } from "apollo-server-micro";
import { NextApiHandler } from "next";
import { RequestHandler } from "micro";

import { schema } from "../../graphql/schema";
import { createContext } from '../../graphql/context';
import { resolvers } from '../../graphql/resolvers';

const cors = Cors();


const handler: NextApiHandler = async (req, res) => {
  if (req.method === 'OPTIONS') {
    res.end();
    return false;
  }

  const apolloServer = new ApolloServer({
    schema,
    resolvers,
    context: await createContext({req, res}),
  });
  
  const startServer = apolloServer.start();
  await startServer;

  await apolloServer.createHandler({
    path: '/api/graphql',
  })(req, res);
}

export const config = {
  api: {
    bodyParser: false,
  },
};

export default cors(handler as RequestHandler);