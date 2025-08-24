import { gql } from "graphql-tag";

// schema to define data types and required data from queries
export default gql`
scalar DateTime


type Repository {
  id: ID!
  name: String!
  size: Int
  owner: String!
  isPrivate: Boolean!
  fileCount: Int
  yamlContent: String
  webhooks: [Webhook!] 
}

type RepositoryConnection {
  nodes: [Repository!]!
  pageInfo: PageInfo!
}


type PageInfo {
  hasNextPage: Boolean!
  endCursor: String
}

type Webhook {
  id: ID!
  name: String
  active: Boolean
  url: String
}

type RateLimit {
  limit: Int!
  remaining: Int!
  resetAt: DateTime!
}

type Query {
  listRepositories(owner: String!, first: Int = 4, token: String): RepositoryConnection!
  repoDetails(owner: String!, name: String!, token: String): Repository!
  rateLimit(token: String): RateLimit!
}
`;
