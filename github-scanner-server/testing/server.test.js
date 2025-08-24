// server.test.js
import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import typeDefs from "../src/server/graphql/schema.js";
import resolvers from "../src/server/graphql/resolvers.js";

let server;
let url;

beforeAll(async () => {
    server = new ApolloServer({ typeDefs, resolvers });
    const started = await startStandaloneServer(server, {
        listen: { port: 0 },
    });
    url = started.url;
});

afterAll(async () => {
    if (server) {
        await server.stop();
    }
});

// test to check that the two types of queries work
test("listRepositories + repoDetails query works", async () => {
    const query = `
    query RepoTest($owner: String!, $name: String!) {
      listRepositories(owner: "lilinlyons") {
        nodes {
          name
          size
          owner
        }
      }
      repoDetails(owner: $owner, name: $name) {
        name
        size
        owner
        isPrivate
        fileCount
        yamlContent
        webhooks {
          id
          url
          active
        }
      }
    }
  `;

    const variables = {
        owner: "lilinlyons",
        name: "repoA",
    };

    const response = await fetch("http://localhost:4000/graphql", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query, variables }),
    });

    const result = await response.json();
    console.log(JSON.stringify(result, null, 2)); // 👈 debug here

    expect(result.errors).toBeUndefined(); // ensure no errors
    expect(result.data.listRepositories).toBeDefined();
    expect(result.data.repoDetails).toBeDefined();
});
