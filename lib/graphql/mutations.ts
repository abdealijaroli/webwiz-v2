import { gql } from '@apollo/client';

export const CREATE_WEBSITE = gql`
  mutation CreateWebsite(
    $name: String!
    $description: String
    $html: String
    $css: String
    $javascript: String
  ) {
    createWebsite(
      name: $name
      description: $description
      html: $html
      css: $css
      javascript: $javascript
    ) {
      id
      name
      description
      html
      css
      javascript
      createdAt
      updatedAt
    }
  }
`;

export const UPDATE_WEBSITE = gql`
  mutation UpdateWebsite(
    $id: ID!
    $name: String
    $description: String
    $html: String
    $css: String
    $javascript: String
  ) {
    updateWebsite(
      id: $id
      name: $name
      description: $description
      html: $html
      css: $css
      javascript: $javascript
    ) {
      id
      name
      description
      html
      css
      javascript
      updatedAt
    }
  }
`;

export const DELETE_WEBSITE = gql`
  mutation DeleteWebsite($id: ID!) {
    deleteWebsite(id: $id)
  }
`;