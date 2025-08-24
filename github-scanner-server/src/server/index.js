
import dotenv from "dotenv";

import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";

import typeDefs from "./graphql/schema.js";
import resolvers from "./graphql/resolvers.js";


dotenv.config();

const server = new ApolloServer({ typeDefs, resolvers });

// standalone server to interact with react rather than doing an express embedded one using middleware.
const { url } = await startStandaloneServer(server, {
    listen: { port: 4000 },
    context: async ({ req }) => ({ req, token: process.env.GITHUB_TOKEN }),
    endpoint: "/graphql",
});

console.log("🚀 GitHub Scanner GraphQL ready at", url + "graphql");
