import connectDB from './app/Database/db.js';
import seedData from './app/Database/seeders.js';
import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { createContext } from './app/Utils/context.js';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import typeDefs from './app/Schemas/index.js';
import resolvers from './app/Resolvers/index.js';

const port = 9000;

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

await connectDB();
await seedData();

const app = await startStandaloneServer(server, {
    listen: {
        port
    },
    context: createContext
});

console.log(`Server ready at ${app.url}`);

console.log(`Server is running at http://localhost:${port}/graphql`);

