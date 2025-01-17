import { gql } from 'graphql-tag';

export const typeDefs = gql`
  type Website {
    id: ID!
    name: String!
    description: String
    html: String
    css: String
    javascript: String
    createdAt: String!
    updatedAt: String!
  }

  type Query {
    websites: [Website!]!
    website(id: ID!): Website
  }

  type Mutation {
    createWebsite(
      name: String!
      description: String
      html: String
      css: String
      javascript: String
    ): Website!
    
    updateWebsite(
      id: ID!
      name: String
      description: String
      html: String
      css: String
      javascript: String
    ): Website!
    
    deleteWebsite(id: ID!): Boolean!
  }
`;