import { gql } from '@apollo/client';

export const GET_WEBSITES = gql`
  query GetWebsites {
    websites {
      id
      name
      description
      createdAt
      updatedAt
    }
  }
`;

export const GET_WEBSITE = gql`
  query GetWebsite($id: ID!) {
    website(id: $id) {
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